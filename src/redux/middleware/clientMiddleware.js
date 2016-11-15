import random from 'lodash/random';
import some from 'lodash/some';
import pickBy from 'lodash/pickBy';

const START_REQUEST = 'frontend-advisor/requests/START_REQUEST';
const END_REQUEST = 'frontend-advisor/requests/END_REQUEST';

export function reducer(state = {}, action) {
  switch (action.type) {
    case START_REQUEST:
      return {
        ...pickBy(state, (val) => !val),
        [`${action.request}$${action.key}`]: false
      };
    case END_REQUEST:
      return {
        ...state,
        [`${action.request}$${action.key}`]: true
      };
    default:
      return state;
  }
}

function startRequest(request, key) {
  return {
    type: START_REQUEST,
    request,
    key
  };
}

function endRequest(request, key) {
  return {
    type: END_REQUEST,
    request,
    key
  };
}

export function isGlobalLoading(globalState) {
  return some(globalState.requests, (val) => !val);
}

export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const randomKey = random(999999);

      const [REQUEST, SUCCESS, FAILURE] = types;
      dispatch(startRequest(REQUEST, randomKey));

      next({...rest, type: REQUEST});

      const actionPromise = promise(client);
      actionPromise.then(
        (result) => {
          dispatch(endRequest(REQUEST, randomKey));
          // setTimeout(() => {
          // }, 5000);
          return next({...rest, result, type: SUCCESS});
        },
        (error) => {
          dispatch(endRequest(REQUEST, randomKey));
          return next({...rest, error, type: FAILURE});
        }
      ).catch((error)=> {
        console.error('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE});
      });

      return actionPromise;
    };
  };
}
