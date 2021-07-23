'use strict';

const proxy = require('http2-proxy');

module.exports = {
    mount: {
        public: { url: '/', static: true },
        src: { url: '/dist' },
    },
    routes: [
        {
            src: '/api/.*',
            dest: (req, res) => proxy.web(req, res, {
                hostname: 'localhost',
                port: 3000,
            }),
        },
    ],
    plugins: [
        '@snowpack/plugin-postcss',
        '@snowpack/plugin-react-refresh',
    ],
    packageOptions: {},
    devOptions: { tailwindConfig: './tailwind.config.js' },
    buildOptions: {},
};
