'use strict';

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    mode: 'jit',
    purge: ['./src/**/*.{js,ts,jsx,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        fontFamily: { sans: ['Nunito Sans', ...defaultTheme.fontFamily.sans] },
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@flybywiresim/tailwind-config'),
    ],
};
