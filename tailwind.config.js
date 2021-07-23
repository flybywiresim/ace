'use strict';

module.exports = {
    purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                panel: { DEFAULT: '#76828E' },
                amber: { DEFAULT: '#ffa500' },
            },
        },
    },
};
