// eslint.config.mjs
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import preferArrowPlugin from 'eslint-plugin-prefer-arrow';
import prettierPlugin from 'eslint-plugin-prettier';

// Prettier preset for flat config
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
	{
		ignores: [
			'**/*.md',
			'**/*.html',
			'tailwind.config.cjs',
			'postcss.config.js',
			'next.config.mjs'
		]
	},

	// ---------------------------------------------------------------------------
	// CORE CONFIG
	// ---------------------------------------------------------------------------
	{
		files: ['**/*.{ts,tsx,js,jsx}'],

		languageOptions: {
			parser: tsParser,
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				projectService: [
					{
						project: 'tsconfig.json'
					}
				]
			}
		},

		plugins: {
			'@typescript-eslint': tsPlugin,
			'react': reactPlugin,
			'import': importPlugin,
			'jsx-a11y': jsxA11yPlugin,
			'prefer-arrow': preferArrowPlugin,
			'prettier': prettierPlugin
		},

		// -------------------------------------------------------------------------
		// RULES CONVERSION (1:1 from your legacy config)
		// -------------------------------------------------------------------------
		rules: {
			// BASE / GENERAL
			'no-template-curly-in-string': 'error',
			'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			'no-var': 'error',
			'no-useless-rename': 'error',
			'object-shorthand': ['error', 'always'],
			'comma-dangle': ['error', 'never'],
			'arrow-body-style': ['error', 'as-needed'],
			'eqeqeq': ['error', 'always'],
			'dot-notation': 'error',
			'prefer-arrow-callback': 'error',
			'prefer-const': 'error',
			'prefer-template': 'error',
			'prefer-arrow/prefer-arrow-functions': 'error',

			// REACT
			'react/function-component-definition': [
				'error',
				{
					namedComponents: 'arrow-function',
					unnamedComponents: 'arrow-function'
				}
			],
			'react/react-in-jsx-scope': 'off',
			'react/self-closing-comp': 'error',
			'react/jsx-boolean-value': ['error', 'never'],
			'react/jsx-curly-brace-presence': ['error', 'never'],
			'react/jsx-curly-spacing': ['error', 'never'],
			'react/jsx-equals-spacing': ['error', 'never'],
			'react/jsx-fragments': ['error', 'syntax'],
			'react/jsx-no-useless-fragment': 'error',
			'react/display-name': 'off',

			// TYPESCRIPT
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'@typescript-eslint/prefer-optional-chain': 'error',
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ args: 'all', argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
			],
			'@typescript-eslint/consistent-type-imports': [
				'warn',
				{ prefer: 'type-imports', fixStyle: 'inline-type-imports' }
			],

			// IMPORT
			'import/order': [
				'error',
				{
					'newlines-between': 'always',
					'groups': [
						'builtin',
						'external',
						'internal',
						'parent',
						'sibling',
						'index'
					]
				}
			],

			// PRETTIER
			'prettier/prettier': 'error'
		},

		settings: {
			'react': { version: 'detect' },
			'import/resolver': {
				node: { paths: ['src'] },
				typescript: {
					extensionAlias: {
						'.js': ['.ts', '.tsx', '.d.ts', '.js'],
						'.jsx': ['.tsx', '.d.ts', '.jsx'],
						'.cjs': ['.cts', '.d.cts', '.cjs'],
						'.mjs': ['.mts', '.d.mts', '.mjs']
					}
				}
			}
		}
	},

	// ---------------------------------------------------------------------------
	// OVERRIDES
	// ---------------------------------------------------------------------------
	{
		files: ['**/*.tsx'],
		rules: {
			'react/prop-types': 'off'
		}
	},

	// ---------------------------------------------------------------------------
	// PRETTIER CONFIG (flat preset)
	// ---------------------------------------------------------------------------
	eslintPluginPrettierRecommended
];
