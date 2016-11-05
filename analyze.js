import jsonfile from 'jsonfile';
import R from 'ramda';

const filePaths = [
  './resources/resources.json',
  './resources/tympanus.json'
];

const resources = R.chain(
  (filePath) => jsonfile.readFileSync(filePath)
)(filePaths);

const has = R.curry((array, item) => array.indexOf(item) > -1);

/* Retrieve all tags and sort them by popularity */
const turnToArray = ([ keyPropName, valuePropName ]) => (object) => {
  const array = [];
  Object.keys(object).forEach((key) => {
    const val = object[key];
    array.push({
      [keyPropName]: key,
      [valuePropName]: val
    });
  });
  return array;
};

const turnToObject = ([ keyPropName, valuePropName ]) => (array) => {
  const object = {};
  array.forEach((item) => {
    object[item[keyPropName]] = item[valuePropName];
  });
  return object;
};

// const countTags = R.pipe(
//   R.chain(R.prop('tag')),
//   R.countBy((tag) => tag),
//   turnToArray(['tag', 'count']),
//   R.sort(({count: after}, {count: before}) => before - after),
//   R.slice(0, 20)
// );

// const tagsResult = countTags(resources);
// console.log(tagsResult);

const ignoreWords = [
  'and', 'to', 'with', 'the', 'or', 'we', 'can', 'this',
  'a', 'an', 'for', 'in', 'of', 'how', 'as', 'from',
  'by', 'your', 'on', 'is', 'that', 'it', 'are', 'be', 'use',
  'at', 'about', 'some', 'will', 'but', 'more', 'like', 'what',
  'one', 'make', 'into', 'when', 'no', 'you', 'using', 'has',
  'best', 'which', 'my', 'was', 'not', 'other', 'so', 'easy',
  'any', 'out', 'need', `it's`, 'all', 'they', 'most', 'our',
  'if', 'there', 'used', 'just', 'should', 'through', 'many',
  'over', 'every', 'also', 'them', 'do', 'have', 'just', 'should',
  'through', 'go', 'its'];

const turnPluralToSingular = (str) => {
  const _exceptions = ['js', 'css', 'angularjs', 'reactjs'];
  if (has(_exceptions, str)) return str;
  if (R.pipe(
    R.split(''),
    R.last,
    R.equals('s'),
  )(str)) {
    return str.slice(0, str.length - 1);
  }
  return str;
};

const getTags = R.pipe(
  R.chain(({description, title}) => ((title || ' ') + (description || '')).split(/[ \.]/)),
  R.map(R.compose(turnPluralToSingular, R.toLower)),
  R.countBy((word) => word),
  turnToArray(['word', 'count']),
  R.filter(R.compose(R.test(/^[a-z]{2,}?$/), R.prop('word'))),
  R.reject(R.compose(
    // R.tap(console.log.bind(console)),
    (n) => n > -1,
    R.flip(R.indexOf)(ignoreWords),
    R.prop('word')
  )),
  R.sort(({count: after}, {count: before}) => before - after),
  R.slice(0, 100),
  turnToObject(['word', 'count'])
);
const possibleTags = getTags(resources);
// console.log(possibleTags);

// const exceptions = ['js', 'css', 'angularjs'];
// const getPluralWords = R.pipe(
//   R.filter(),
//   R.without(exceptions)
//   // turnPluralToSingular
// );
// console.log('Plural words: ');
// const pluralWords = R.pipe(
//   R.keys,
//   getPluralWords
// )(possibleTags);
// console.log(pluralWords);

const resource = {
  description: 'A couple of modern and subtle tab styles and effects for your inspiration. We use pseudo-elements, SVGs and CSS transitions for some of the techniques.',
  title: 'Tab Styles Inspiration | Codrops',
  url: 'http://tympanus.net/codrops/2014/09/02/tab-styles-inspiration/'
};

const suggestTags = R.pipe(
  getTags,
  turnToArray(['word', 'count']),
  R.reject(({ word }) => !possibleTags[word]),
  R.map(({word, count}) => ({ word, count, globalCount: possibleTags[word] }))
);
const suggestedTags = suggestTags([resource]);
console.log(suggestedTags);
