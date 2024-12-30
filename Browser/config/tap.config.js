module.exports = {
  // Use ts-node to transpile TypeScript tests
  files: ['../project/__specs__/tap/**/*.ts'],
  nodeArgs: ['--loader', 'ts-node/esm'],
  // Enable TypeScript and ESM compatibility
  extensions: ['ts'],
  // Run tests in parallel
  jobs: 4,
  // Run tests in sequence
  // jobs: 1,
  // Enable TAP output (the default)
  reporter: 'tap',
  // Collect coverage using Node-TAP's built-in coverage tool
  coverage: true,
  // Exit with error if coverage falls below thresholds
  'coverage-report': ['text', 'html'],
  'check-coverage': true,
  'coverage-threshold': {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
}
