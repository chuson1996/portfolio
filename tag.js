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

const filePath = process.argv[2];
const option = process.argv[3];
const content = jsonfile.readFileSync(filePath);
let resources = [];


const writeToDest = (_filePath, contentJson) => {
  // console.log(contentJson);
  jsonfile.writeFileSync(_filePath, contentJson);
};

if (option === '--all') {
  resources = content;
} else if (option === '---non-tagged' || !option) {
  resources = content.filter((resource) => !resource.tags || !resource.tags.length);
} else {
  throw new Error(`Unknow option ${option}`);
}

const newJson = cloneDeep(resources);

resources.forEach((resource, index) => {
  let tags = resource.tags || [];

  const startTag = () => {
    console.log(`---------- ${index + 1}/${resources.length} ----------`);
    console.log('Url'.underline.yellow + ': ' + resource.url);
    console.log('Title'.underline.yellow + ': ' + resource.title);
    console.log('Description'.underline.yellow + ': ' + resource.description);

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

  return {
    ...resource,
    tags
  };
});
