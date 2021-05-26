import * as fs from 'fs';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import { readPanel } from './server/panel';

const server = new Koa();
const router = new Router();

const apiRouter = new Router({ prefix: '/api' })
    .get('/instruments', (ctx) => {
        const instruments = fs.readdirSync('../src/', { withFileTypes: true })
            .filter((d) => d.isDirectory() && fs.existsSync(`../src/${d.name}/config.json`))
            .map((d) => d.name);

        ctx.body = instruments.map((instrument) => ({
            name: instrument,
            path: `src/${instrument}`,
        }));
    })
    .get('/instrument/:name', (ctx) => {
        const jsBundle = fs.readFileSync(`./bundles/${ctx.params.name}/bundle.js`).toString();
        const cssBundle = fs.readFileSync(`./bundles/${ctx.params.name}/bundle.css`).toString();

        ctx.body = {
            js: jsBundle,
            css: cssBundle,
        };
    })
    .get('/panel', (ctx) => {
        const path = '../../../flybywire-aircraft-a320-neo/SimObjects/AirPlanes/FlyByWire_A320_NEO/panel/panel.cfg';

        const panel = readPanel(path);

        ctx.body = JSON.stringify(panel);
        ctx.type = 'application/json';
    });

router.use(apiRouter.routes());

server.use(router.routes());

server.listen(3000);

console.log('Server running on port 3000');
