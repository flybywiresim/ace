'use strict';

const defaultTheme = require('tailwindcss/defaultTheme');

const reactComponentsClasses = require('./node_modules/@flybywiresim/react-components/build/usedCSSClasses.json');

module.exports = {
    mode: 'jit',
    purge: {
        enabled: true,
        content: [
            './src/**/*.{js,ts,jsx,tsx}',
        ],
        safelist: [
            ...reactComponentsClasses,
        ],
    },
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: {
            sans: ['Nunito Sans', ...defaultTheme.fontFamily.sans],
            mono: ['Nova Mono', ...defaultTheme.fontFamily.mono],
        },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        // eslint-disable-next-line global-require
        require('@flybywiresim/tailwind-config'),
    ],
};
