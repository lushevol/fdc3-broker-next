import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      "no-debugger": "error",
      "no-dupe-keys": "error",
      "no-unreachable": "error",
      "no-eval": "error",
      "no-new-func": "error",
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: "error",
      "no-throw-literal": "error",
    },
  },
];
