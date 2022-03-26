import fs from 'fs';
import { BundledInstrumentData } from '../../../../ace-engine/src/InstrumentData';

export type LiveReloadSubscriptionHandler = (fileName: string, contents: string) => void;

export class LiveReloadDispatcher {
    constructor(
        private instrument: BundledInstrumentData,
    ) {
    }

    private subscriptions: { [k: string]: LiveReloadSubscriptionHandler; } = {};

    private watchers: fs.FSWatcher[] = [];

    public startWatching() {
        for (const file of [this.instrument.jsSource, this.instrument.cssSource]) {
            console.log(`[LiveReloadDispatcher] Watching '${file.path}'...`);
            this.watchers.push(
                fs.watch(file.path, this.handleFileUpdate.bind(this, this.instrument.displayName, file.path)),
            );
        }
    }

    public stopWatching() {
        for (const watcher of this.watchers) {
            watcher.close();
        }

        console.log('[LiveReloadDispatcher] Closed all watchers.');
    }

    private handleFileUpdate(instrumentName: string, fileName: string) {
        for (const subscription of Object.entries(this.subscriptions)) {
            if (subscription[0] === instrumentName) {
                const contents = fs.readFileSync(fileName).toString();

                (subscription[1])(fileName, contents);
            }
        }
    }

    public subscribe(forInstrument: string, handler: LiveReloadSubscriptionHandler) {
        this.subscriptions[forInstrument] = handler;

        return handler;
    }

    public unsubscribe(handler: LiveReloadSubscriptionHandler) {
        // FIXME memory leak, cancel actual FsWatcher
        const entry = Object.entries(this.subscriptions).find((ent) => ent[1] === handler);

        if (entry) {
            this.subscriptions[entry[0]] = undefined;
        }
    }
}
