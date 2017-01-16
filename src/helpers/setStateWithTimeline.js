import lensProp from 'ramda/src/lensProp';
import set from 'ramda/src/set';
import view from 'ramda/src/view';
import merge from 'ramda/src/merge';
import lensPath from 'ramda/src/lensPath';

const last = (arr) => arr[arr.length - 1];

const calculateNewState = (state, newVal, path) =>
  set(
    lensProp(path),
    merge(
      view(
        lensProp(path),
        state
      ),
      newVal),
    state
  );

export default (context, timeline, path) => {
  if (Array.isArray(timeline)) {
    // Timeline is an array [['200', () => ({...})], ['+200', () => ({...})]]
    // const timeouts = [];
    return timeline
      .reduce((result, [time, newStateFunc], index) => {
        if (typeof time === 'number') return [...result, [time, newStateFunc]];
        else if (typeof time === 'string') {
          if (/^\d{1,}$/.test(time)) return [...result, [parseInt(time, 10), newStateFunc]];
          else if (/^\+\d{1,}$/.test(time)) {
            const _time = last(result)[0] + parseInt(time.split('+')[1], 10);
            return [...result, [_time, newStateFunc]];
          }
        }

        throw new Error('Invalid format of timeline');
      }, [])
      .map(([time, newStateFunc]) => {
        return setTimeout(() =>
          context.setState(path ?
            calculateNewState(context.state, newStateFunc(), path) :
            newStateFunc()
          ),
          time);
      });
  } else if (typeof timeline === 'object') {
    return Object.keys(timeline).map((time) => {
      const newStateFunc = timeline[time];
      return setTimeout(() =>
        context.setState(path ?
          calculateNewState(context.state, newStateFunc(), path) :
          newStateFunc()
        ),
        parseInt(time, 10));
    });
  }

  throw new Error('Invalid format of timeline.');
};

const isSpringPreset = (value) => (
  value.hasOwnProperty('damping') &&
  value.hasOwnProperty('precision') &&
  value.hasOwnProperty('stiffness') &&
  value.hasOwnProperty('val')
);

export const se = (object) => {
  const result = {};
  const writeToResult = (key, val) => { result[key] = val; };

  const start = (prefix = '', obj) => {
    if (typeof obj === 'object' && !isSpringPreset(obj)) {
      Object.keys(obj).forEach((key) => {
        const val = obj[key];
        if (prefix) start(`${prefix}.${key}`, val);
        else start(`${key}`, val);
      });
    } else {
      writeToResult(prefix, obj);
    }
  };
  start('', object);
  return result;
};

export const de = (object) => {
  let result = {};
  Object.keys(object).forEach((key) => {
    const val = object[key];
    result = set(lensPath(key.split('.')), val, result);
  });
  return result;
};
