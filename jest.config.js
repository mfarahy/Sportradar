// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
   verbose: true,
  preset: 'ts-jest',
  rootDir: './test',
  collectCoverage: true,
  forceExit: true,
  detectOpenHandles: true,
  setupFiles: ['dotenv/config'],
};

module.exports = config;
