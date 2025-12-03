
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import { hasForbiddenLayoutTokens } from './src/lib/guardrails.js'

export default defineConfig([
  globalIgnores(['dist', 'vite.config.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/restrict-template-expressions': 'warn',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-refresh/only-export-components': 'off',
      'react/no-danger': 'warn',
    },
  },
  // Custom guardrail for Templates: ban raw layout tokens in className
  {
    files: ['src/components/Templates/*.{ts,tsx}'],
    plugins: {
      'custom-tailwind': {
        rules: {
          'no-raw-layout-tokens': {
            meta: {
              type: 'problem',
              docs: {
                description: 'Forbids the use of raw layout utility classes in className strings of core components.',
              },
              schema: [],
            },
            create(context) {
              return {
                JSXAttribute(node) {
                  if (node.name.name === 'className') {
                    const value = node.value?.expression?.quasis ? node.value.expression.quasis[0].value.raw : node.value?.value;
                    if (value && hasForbiddenLayoutTokens(value)) {
                      context.report({
                        node: node.value,
                        message: 'Architectural Violation: Do not use raw spacing/sizing utility classes (p-*, m-*, max-w-*) directly. Use a helper function from src/layout/layoutConfig.ts to maintain design tokens.',
                      });
                    }
                  }
                }
              };
            },
          },
        },
      },
    },
    rules: {
      'custom-tailwind/no-raw-layout-tokens': 'error',
    },
  },
])
