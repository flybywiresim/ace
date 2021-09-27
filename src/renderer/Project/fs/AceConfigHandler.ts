import { remote } from 'electron';
import path from 'path';
import { GenericConfigHandler } from './GenericConfigHandler';

interface AceConfig {
    richPresenceEnabled: boolean;
}

export class AceConfigHandler extends GenericConfigHandler<AceConfig> {
    get fileName(): string {
        return 'aceconfig';
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
