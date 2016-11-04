import jsonfile from 'jsonfile';
import flatten from 'lodash/fp/flatten';
import flow from 'lodash/flow';
import reduce from 'lodash/fp/reduce';
import map from 'lodash/fp/map';
import sortBy from 'lodash/fp/sortBy';
import reverse from 'lodash/fp/reverse';
import keys from 'lodash/keys';

const filePaths = [
  './resources/resources.json',
  './resources/tympanus.json'
];

const resources = flow(
  map((filePath) => jsonfile.readFileSync(filePath)),
  flatten
)(filePaths);

/* Retrieve all tags and sort them by popularity */

const collectTag = reduce((result, item) => {
  item.tags.forEach((tag) => {
    if (!result[tag]) result[tag] = 0;
    result[tag]++;
  });

  return result;
}, {});

let tagsResult = flow(
  collectTag
)(resources);

tagsResult = keys(tagsResult).map((tag) => ({ tag, number: tagsResult[tag] }));

tagsResult = flow(sortBy('number'), reverse)(tagsResult);

console.log(tagsResult);
