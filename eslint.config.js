import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  // Recommended configuration from @eslint/js
  pluginJs.configs.recommended,

  // Language options
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
  },

  // Main configuration
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    ignores: ['**/*.config.js', '/*.eslint-config-inspector', 'node_modules/**'],
    rules: {
      'no-unused-vars': 'warn',
      semi: ['warn', 'always'],
      quotes: ['warn', 'single'],
      'no-undef': 'warn',
      'no-redeclare': 'error',
      'no-empty': 'warn',
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: 'warn',
    },
  },
];
