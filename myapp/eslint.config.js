const js = require('@eslint/js');
const globals = require('globals');
const prettier = require('eslint-config-prettier');
const importPlugin = require('eslint-plugin-import');

module.exports = [
    js.configs.recommended,
    prettier,
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
        plugins: { import: importPlugin },
        rules: {
            'no-unused-vars': 'warn',
            'prefer-const': 'warn',
            'import/order': [
                'warn',
                {
                    groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
                    'newlines-between': 'always',
                },
            ],
        },
    },
];
