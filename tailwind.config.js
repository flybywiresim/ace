'use strict';

module.exports = {
    mode: 'jit',
    purge: ['./src/**/*'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@flybywiresim/tailwind-config'),
    ],
};
