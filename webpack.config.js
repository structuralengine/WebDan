const path = require('path');

module.exports = {
  entry: './app/scripts/services/lodash-id.webpack.js',
  output: {
    path: path.resolve(__dirname, 'app/scripts/services'),
    filename: 'lodash-id.js'
  }
};
