import path from 'path';
import { fileURLToPath } from 'url';
import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseParser from '@typescript-eslint/parser';
import esImport from 'eslint-plugin-import';
import perfectionist from 'eslint-plugin-perfectionist';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

const project = ['./tsconfig.json', './tsconfig.node.json'];
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * for backward compatibility
 *
 * @see https://github.com/import-js/eslint-plugin-import/issues/2948#issuecomment-2148832701
 */
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended
});

/**
 * @param {string} name the pugin name
 * @param {string} alias the plugin alias
 * @returns {import("eslint").ESLint.Plugin}
 */
function legacyPlugin(name, alias = name) {
  const plugin = compat.plugins(name)[0]?.plugins?.[alias];

  if (!plugin) {
    throw new Error(`Unable to resolve plugin ${name} and/or alias ${alias}`);
  }

  return fixupPluginRules(plugin);
}

export default [
  eslint.configs.recommended,
  stylistic.configs['recommended-flat'],
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  ...compat.extends('plugin:react-hooks/recommended'),
  {
    files: ['**/*.js', '**/*.cjs', '**/*.ts', '**/*.tsx']
  },
  {
    ignores: [
      '**/node_modules/**/*',
      '**/libs/**/*',
      '**/*.css.d.ts',
      '**/*.scss.d.ts',
      '**/*.config.js',
      'dist/**/*',
      'public/**/*',
      'scripts/**/*',
      '.prettierrc.cjs'
    ]
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseParser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project,
        ecmaFeatures: {
          jsx: true,
          module: true,
          legacyDecorators: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        log: 'readonly'
      }
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@src', './src'],
            ['', './public']
          ],
          extensions: ['.js', '.ts', '.tsx']
        }
      },
      react: {
        version: 'detect'
      }
    },
    rules: {
      'prettier/prettier': ['off', {}],

      'arrow-body-style': 'off',
      'class-methods-use-this': 'off',
      'max-classes-per-file': 'off',
      'no-bitwise': 'off',
      'no-console': 'off',
      'no-continue': 'off',
      'no-empty': 'warn',
      'no-empty-pattern': 'warn',
      'no-nested-ternary': 'off',
      'no-param-reassign': 'warn',
      'no-restricted-exports': 'off',
      'no-restricted-syntax': 'off',
      'no-unused-vars': 'off',
      'no-underscore-dangle': 'off',
      'no-use-before-define': 'off',
      'no-useless-constructor': 'off',
      'no-var': 'warn',
      'prefer-arrow-callback': 'off',
      'prefer-destructuring': 'off',
      'no-param-reassign': [
        'error',
        {
          props: true,
          ignorePropertyModificationsForRegex: ['^draft']
        }
      ]
    }
  },
  {
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': ['off', {}]
    }
  },
  {
    plugins: {
      import: esImport
    },
    rules: {
      'import/extensions': ['error', 'never', { ignorePackages: true }],
      'import/no-absolute-path': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-unresolved': [
        'error',
        { caseSensitive: true, ignore: ['\\.svg\\?react$'] }
      ],
      'import/prefer-default-export': 'off'
    }
  },
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/indent': 'off',
      '@stylistic/indent-binary-ops': 'off',
      '@stylistic/implicit-arrow-linebreak': 'off',
      '@stylistic/lines-between-class-members': 'off',
      '@stylistic/object-curly-newline': [
        'error',
        { multiline: true, consistent: true }
      ],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/max-len': 'off',
      '@stylistic/max-statements-per-line': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/no-confusing-arrow': 'off',
      '@stylistic/no-multiple-empty-lines': 'off',
      '@stylistic/padded-blocks': ['off', 'never'],
      '@stylistic/quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true
        }
      ],
      '@stylistic/semi': ['warn', 'always']
    }
  },
  {
    plugins: {
      tseslint
    },
    rules: {
      '@typescript-eslint/ban-types': 'warn',
      '@typescript-eslint/class-literal-property-style': 'off',
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-useless-constructor': 'warn',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTaggedTemplates: true
        }
      ],
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/return-await': 'off'
    }
  },
  {
    plugins: {
      perfectionist
    },
    rules: {
      'perfectionist/sort-objects': 'off',
      'perfectionist/sort-object-types': 'off',
      'perfectionist/sort-interfaces': 'off',
      'perfectionist/sort-svelte-attributes': 'off',
      'perfectionist/sort-classes': 'off',
      'perfectionist/sort-enums': 'off',
      'perfectionist/sort-union-types': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          'nullable-last': true
        }
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
          groups: [
            'type',
            'react',
            ['builtin', 'external'],
            'side-effect',
            'internal-type',
            'internal',
            ['parent-type', 'sibling-type', 'index-type'],
            ['parent', 'sibling', 'index'],
            'style',
            'object',
            'unknown'
          ],
          'custom-groups': {
            value: {
              react: ['react', 'react-*']
            },
            type: {
              react: 'react'
            }
          },
          'newlines-between': 'never',
          'internal-pattern': ['@src/**']
        }
      ]
    }
  },
  {
    plugins: {
      'react-refresh': reactRefresh
    },
    rules: {
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  },
  {
    plugins: {
      react: legacyPlugin('eslint-plugin-react', 'react')
    },
    rules: {
      'react/require-default-props': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': 'warn',
      'react/static-property-placement': 'off',
      'react/prefer-stateless-function': 'off',
      'react/function-component-definition': [
        1,
        {
          namedComponents: [
            'function-declaration',
            'function-expression',
            'arrow-function'
          ],
          unnamedComponents: ['function-expression', 'arrow-function']
        }
      ],
      'react/sort-comp': 'off',
      'react/no-unused-prop-types': 'warn',
      'react/jsx-filename-extension': ['warn', { extensions: ['.ts', '.tsx'] }],
      'react/destructuring-assignment': ['off', 'never'],
      'react/jsx-props-no-spreading': 'off',
      'react/forbid-prop-types': 'off',
      'react/jsx-one-expression-per-line': 'off',

      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ]
    }
  },
  {
    plugins: {
      // 'react-hooks': legacyPlugin('eslint-plugin-react-hooks', 'react-hooks')
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn'
    }
  },
  {
    plugins: {
      html: legacyPlugin('eslint-plugin-html', 'html')
    },
    rules: {}
  }
];
