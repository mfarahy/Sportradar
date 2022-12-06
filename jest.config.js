// Sync object
/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  preset: 'ts-jest',
  rootDir: './src',
  collectCoverage: true,
  forceExit: true,
  detectOpenHandles: true,
};

module.exports = config;
