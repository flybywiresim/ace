'use strict';

module.exports = {
    root: true,
    env: { browser: true },
    extends: '@flybywiresim/eslint-config',
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'script',
        requireConfigFile: false,
    },
    settings: { 'import/resolver': { node: { extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx'] } } },
    overrides: [
        {
            files: ['*.jsx', '*.tsx'],
            parserOptions: {
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
        },
        {
            files: ['*.mjs', '*.ts', '*.d.ts'],
            parserOptions: { sourceType: 'module' },
        },
    ],
    rules: {
        'no-control-regex': 'off',
        'no-undef': 'off',
        'linebreak-style': 'off',

        // Irrelevant for our use
        'jsx-a11y/alt-text': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
    },
};
