/* eslint-disable */

var fs = require('fs-extra');

var componentType = process.argv[2];
var componentName = process.argv[3];

const createContent = (name) => `import React, { Component, PropTypes } from 'react';

export default class ${name} extends Component {
  static propTypes = {};

  render() {
    return (
      <div>
      </div>
    );
  }
}
`;

if (componentType !== 'component' && componentType !== 'container') {
  console.log('Wrong type of component');
  process.exit();
}

// fs.ensureFileSync(`./src/${componentType}s/${componentName}.js`);
fs.ensureFileSync(`./src/${componentType}s/${componentName}/${componentName}.scss`);

fs.outputFileSync(`./src/${componentType}s/${componentName}/${componentName}.js`, createContent(componentName));

var indexFileContent = fs.readFileSync(`./src/${componentType}s/index.js`).toString();

var lines = indexFileContent.split('\n');

var newLine = `export ${componentName} from './${componentName}/${componentName}';`;

if (lines.indexOf(newLine) === -1) {
  lines.pop(); // Remove the empty line at the end
  lines.push(newLine);
  lines.push(''); // Add an empty line at the end
}

fs.outputFileSync(`./src/${componentType}s/index.js`, lines.join('\n'));
