/* Instruction:

  babel-node tags.js [filePath] [option]

  Options:
  --all         : Tag all resouces in the file
  --non-tagged  : (default) Tag only those that haven't been tagged

 */
require('colors');
const jsonfile = require('jsonfile');
const readlineSync = require('readline-sync');
const cloneDeep = require('lodash/cloneDeep');
const R = require('ramda');

const filePath = process.argv[2];
const option = process.argv[3];
const content = jsonfile.readFileSync(filePath);

const filePaths = [
  './resources/resources.json',
  './resources/tympanus.json',
  './resources/cssVideos.json'
];

const allResources = R.chain(
  (path) => jsonfile.readFileSync(path)
)(filePaths);

let resources = [];


const writeToDest = (_filePath, contentJson) => {
  // console.log(contentJson);
  jsonfile.writeFileSync(_filePath, contentJson);
};

resources = content;

const has = R.curry((array, item) => array.indexOf(item) > -1);
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
  'through', 'go', 'its', 'only', 'very', 'been', 'where', 'there',
  'know', 'thing', 'work'];
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
const possibleTags = getTags(allResources);
const suggestTags = R.pipe(
  getTags,
  turnToArray(['word', 'count']),
  R.reject(({ word }) => !possibleTags[word]),
  R.map(({word, count}) => ({ word, count, globalCount: possibleTags[word] }))
);

const newJson = cloneDeep(resources);

const tagRegExp = (word) => {
  const [fC, ...rest] = word.split('');
  return new RegExp(`[${fC}${fC.toUpperCase()}]${rest.join('')}`);
};

const colorWordReplace = (color) => (str) => R.replace(tagRegExp(str), str[color]);

resources.forEach((resource, index) => {
  if (option === '---non-tagged' || !option) {
    if (resource.tags && resource.tags.length) return;
  }

  let tags = resource.tags || [];

  const suggestedTags = R.pipe(
    suggestTags,
    R.pluck('word')
  )([resource]);

  console.log(suggestedTags);

  const highlight = R.pipe(
    R.tap(() => {}),
    ...R.map(colorWordReplace('green'))(suggestedTags)
  );

  const highlightedTitle = highlight(resource.title || '');
  const highlightedDescription = highlight(resource.description || '');

  const startTag = () => {
    console.log(`---------- ${index + 1}/${resources.length} ----------`);
    console.log('Url'.underline.yellow + ': ' + resource.url);
    console.log('Title'.underline.yellow + ': ' + highlightedTitle);
    console.log('Description'.underline.yellow + ': ' + highlightedDescription);

    console.log('Tags: ');
    if (tags.length) {
      tags.forEach((tag) => {
        console.log(`> ${tag}`);
      });
    }
    readlineSync.promptLoop((input) => {
      if (input === '') return true;

      tags.push(input);
    });

    const confident = readlineSync.keyInYN(
      `Are you confident with this tags: ${tags}`
    );

    if (!confident) {
      tags = [];
      startTag();
    } else {
      newJson[index] = { ...resource, tags };
      // console.log(newJson);
      writeToDest(filePath, newJson);
      // console.log('\033[2J');
      // console.log('\033c');
      console.log('\x1Bc');
    }
  };
  startTag();
});
