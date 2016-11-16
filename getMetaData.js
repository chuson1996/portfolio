const jsonfile = require('jsonfile');
const MetaInspector = require('node-metainspector');
const async = require('async');
// const flatten = require('lodash/flatten');

const filePath = process.argv[2];

// const files = [
//   './resources/resources.json',
//   './resources/tympanus.json'
// ];
const resources = jsonfile.readFileSync(filePath);

const promises = [];

const format = (str) => {
  return str.replace(/\\n/g, ' ').replace(/\s{2,}/, ' ');
};

const overrideResource = (index) => (callback) => {
  console.log(resources[index].title);
  const client = new MetaInspector(
    resources[index].url,
    { timeout: 5000 }
  );

  client.on('fetch', () => {
    console.log(Math.floor(index / resources.length * 100) + '%');

    if (client.description) {
      resources[index].description = format(client.description);
    }
    if (client.title) {
      resources[index].title = client.title;
    }
    jsonfile.writeFile(filePath, resources, () => {
      console.log('Title: ' + resources[index].title);
      console.log('Description: ' + resources[index].description);
      console.log('-----------------');
    });
    callback();
  });

  client.on('error', (/* err */) => {
    // console.log(err);
    callback();
  });

  client.fetch();
};

resources.forEach((resource, index) => {
  if (resource.description && resource.title) return;
  promises.push(overrideResource(index));
});

async.series(promises, () => {
  console.log('Done');
});
