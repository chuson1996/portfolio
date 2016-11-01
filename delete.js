/* eslint-disable */

var fs = require('fs-extra');

var componentType = process.argv[2];
var componentName = process.argv[3];

if (componentType !== 'component' && componentType !== 'container') {
  console.log('Wrong type of component');
  return;
}

fs.removeSync(`./src/${componentType}s/${componentName}`);

var indexFileContent = fs.readFileSync(`./src/${componentType}s/index.js`).toString();

var lines = indexFileContent.split('\n');

var theLine = `export ${componentName} from './${componentName}/${componentName}';`;


var index = lines.indexOf(theLine);
if (index !== -1) {
  lines.slice(index, 1);
}

fs.outputFileSync(`./src/${componentType}s/index.js`, lines.join('\n'));
