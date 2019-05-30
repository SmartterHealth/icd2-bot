const path = require('path');
module.exports = {
    entry: path.resolve(__dirname, './lib/index.js'),
    output: {
      path: path.resolve(__dirname, './deployment'),
      filename: 'index.js',
      libraryTarget: 'commonjs'
    },
    target: 'node',
    mode: 'production'
}