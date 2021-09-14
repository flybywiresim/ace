'use strict';

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,ts,jsx,tsx}'],
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
