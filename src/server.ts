import * as fs from 'fs';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import { readPanelUnsafe } from './server/panel';
import { ProjectCreationParams, ProjectLoadingParams } from './common/project';
import { createProjectUnsafe, loadProjectUnsafe, validateProjectCreation, validateProjectLoading } from './server/project';

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
        const path = '../../../PackageSources/SimObjects/AirPlanes/s4f_a350/panel/panel.cfg';

        const panel = readPanelUnsafe(path);

        ctx.body = JSON.stringify(panel);
        ctx.type = 'application/json';
    })
    .post('/project', (ctx) => {
        const creationParams = ctx.request.body as ProjectCreationParams;

        const projectValidationResult = validateProjectCreation(creationParams);

        if (projectValidationResult === true) {
            const project = createProjectUnsafe(creationParams);

            ctx.body = JSON.stringify(project);
        } else {
            ctx.status = 400;
            ctx.body = { error: projectValidationResult };
        }
    })
    .post('/project/load', (ctx) => {
        const loadingParams = ctx.request.body as ProjectLoadingParams;

        const projectValidationResult = validateProjectLoading(loadingParams);

        if (projectValidationResult === true) {
            const project = loadProjectUnsafe(loadingParams);

            ctx.body = JSON.stringify(project);
        } else {
            ctx.status = 400;
            ctx.body = { error: projectValidationResult };
        }
    });

router.use(apiRouter.routes());

server.use(bodyParser());
server.use(router.routes());

server.listen(3000);

console.log('Server running on port 3000');
