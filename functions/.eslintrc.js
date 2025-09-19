module.exports = {
  env: {
    es2021: true, // Updated from es6: true to support modern JS (equivalent to ecmaVersion 12)
    node: true, // Ensures Node.js globals like module, require, exports are recognized
  },
  parserOptions: {
    ecmaVersion: 12, // Matches es2021 (2018 => 12 for consistency)
    sourceType: 'module', // Supports ES modules, but Node.js environment handles CommonJS
  },
  extends: [
    'eslint:recommended', // Basic recommended rules
    'google', // Keep your Google style guide
  ],
  rules: {
    'no-restricted-globals': ['error', 'name', 'length'], // Your existing rule
    'prefer-arrow-callback': 'error', // Your existing rule
    'quotes': ['error', 'double', { allowTemplateLiterals: true }], // Your existing rule
    'no-undef': 'error', // Explicitly enable to catch undefined variables (but Node.js globals are now recognized)
  },
  overrides: [
    {
      files: ['**/*.spec.*'],
      env: {
        mocha: true, // Keep Mocha environment for test files
      },
      rules: {},
    },
  ],
  globals: {}, // Keep your empty globals object
};