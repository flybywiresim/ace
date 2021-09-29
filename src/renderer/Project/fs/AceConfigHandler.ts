import { remote } from 'electron';
import path from 'path';
import { GenericConfigHandler } from './GenericConfigHandler';

export interface AceConfig {
    richPresenceEnabled: boolean;
}

export class AceConfigHandler extends GenericConfigHandler<AceConfig> {
    constructor() {
        super('');
    }

    get fileName(): string {
        return 'ace-config.json';
    }

    get filePath(): string {
        return path.join(remote.app.getPath('userData'), this.fileName);
    }

    createConfig(): AceConfig {
        return {
            richPresenceEnabled: false,
        };
    }
}
