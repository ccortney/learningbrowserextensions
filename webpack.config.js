const path = require('path');

module.exports = {
  mode: 'development',
  entry: './background.js',
  // This will output a single file under `dist/bundle.js`
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  watch: true,
}