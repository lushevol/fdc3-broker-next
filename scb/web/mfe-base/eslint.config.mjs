import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      ecmaVersion: 2020,
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    plugins: {
      ...jsxA11y.flatConfigs.recommended.plugins,
      "react-hooks": reactHooks,
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      "constructor-super": "error",
      "no-console": [
        "error",
        { allow: ["warn", "error", "info"] },
      ],
      "no-constant-condition": "error",
      "no-debugger": "error",
      "no-dupe-args": "error",
      "no-dupe-class-members": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-duplicate-imports": "error",
      "no-empty-pattern": "error",
      "no-extra-bind": "error",
      "no-implied-eval": "error",
      "no-labels": "error",
      "no-obj-calls": "error",
      "no-self-assign": "error",
      "no-self-compare": "error",
      "no-shadow-restricted-names": "error",
      "no-this-before-super": "error",
      "no-throw-literal": "error",
      "no-unreachable": "error",
      "no-unsafe-negation": "error",
      "no-void": "error",
      "no-with": "error",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-autofocus": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "off",
      "use-isnan": "error",
    },
  },
  {
    files: ['src/new-styles/**/*.{ts,tsx}'],
    rules: { 'react-hooks/exhaustive-deps': 'error' },
  },
  {
    files: ['src/**/*.test.{ts,tsx}'],
    rules: { 'no-void': 'off' },
  },
];
