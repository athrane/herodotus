import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

export default [
  // Ignore build artifacts and coverage
  {
    ignores: ['dist/**', 'coverage/**', 'node_modules/**'],
  },

  // JavaScript (Node ESM)
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      // Ensure TS-only rules do not bleed into JS files
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // TypeScript (uses the meta package to include parser + plugin recommended)
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      // Start lenient; tighten later
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Shared globals for both JS and TS
  {
    files: ['**/*.{js,ts}'],
    languageOptions: {
      sourceType: 'module',
      globals: globals.node,
    },
  },

  // Tests: enable Jest globals (rules optional)
  {
    files: ['test/**/*.{js,ts}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
    plugins: { jest },
    rules: {
      // Tests often have unused helpers/imports; keep noise low
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-array-constructor': 'off',
    },
    // You can opt into Jest recommended rules later if desired:
    // ...jest.configs['flat/recommended']
  },

  // Final JS override: keep TS-specific rules off in JS files
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-array-constructor': 'off',
      // Reduce friction while adopting ESLint
      'no-unused-vars': 'warn',
    },
  },
];
