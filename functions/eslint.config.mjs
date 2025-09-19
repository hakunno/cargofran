// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended, // ESLint's recommended rules
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // adds Node.js globals like process, __dirname
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
  },
];