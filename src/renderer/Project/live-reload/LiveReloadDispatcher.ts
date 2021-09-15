import fs from 'fs';
import { ProjectData } from '../../index';
import { ProjectInstrumentsHandler } from '../fs/Instruments';

export type LiveReloadSubscriptionHandler = (fileName: string, contents: string) => void;

export class LiveReloadDispatcher {
    constructor(
        private project: ProjectData,
    ) {
    }

    public startWatching() {
        const allProjectInstruments = ProjectInstrumentsHandler.loadAllInstruments(this.project);

        for (const instrument of allProjectInstruments) {
            for (const file of instrument.files) {
                console.log(`[LiveReloadDispatcher] Watching '${file.path}'...`);

                fs.watch(file.path, this.handleFileUpdate.bind(this, instrument.config.name, file.path));
            }
        }
    }

    private handleFileUpdate(instrumentName: string, fileName: string) {
        for (const subscription of Object.entries(this.subscriptions)) {
            if (subscription[0] === instrumentName) {
                const contents = fs.readFileSync(fileName).toString();

                (subscription[1])(fileName, contents);
            }
        }
    }

    private subscriptions: { [k: string]: LiveReloadSubscriptionHandler; } = {};

    public subscribe(forInstrument: string, handler: LiveReloadSubscriptionHandler) {
        this.subscriptions[forInstrument] = handler;

        return handler;
    }

    public unsubscribe(handler: LiveReloadSubscriptionHandler) {
        this.subscriptions[
            Object.entries(this.subscriptions)
                .find((ent) => ent[1] === handler)[0]
        ] = undefined;
    }
}
