const base = require('../../jest.config.js');
module.exports = {
  ...base,
  rootDir: __dirname,
  setupFilesAfterEnv: [require.resolve('./jest.setup.js')],
}; 