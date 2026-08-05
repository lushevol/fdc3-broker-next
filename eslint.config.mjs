import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['**/dist', '**/build', '**/node_modules', '**/coverage', '**/.turbo', '**/.docusaurus', 'sc-dev-web/**'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
    },
    rules: {
      ...eslintConfigPrettier.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['packages/fdc3-broker/**/*.{ts,tsx}'],
    rules: {
      // The broker deliberately probes untyped OpenFin globals and malformed values in
      // conformance/security tests. Keep the exception local to this integration boundary.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^(_|intent$)',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^error$',
        },
      ],
    },
  },
);
