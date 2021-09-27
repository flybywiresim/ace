import fs from 'fs';
import path from 'path';

export abstract class GenericConfigHandler<T> {
    constructor(
        private path: string,
    ) {
    }

    abstract get fileName(): string;

    protected get filePath() {
        return path.join(this.path, '.ace', this.fileName);
    }

    public loadConfig(): T {
        if (!fs.existsSync(this.filePath)) {
            const newConfig = this.createConfig();

            this.saveConfig(newConfig);

            return newConfig;
        }

        const configContents = fs.readFileSync(this.filePath).toString();

        let configObject: T;
        try {
            configObject = JSON.parse(configContents);
        } catch (e: any) {
            throw new Error(`[ProjectConfigHandler] Cannot parse '${this.fileName}': ${e.message ?? e}`);
        }

        return configObject;
    }

    public saveConfig(object: T): void {
        const configContents = JSON.stringify(object);

        fs.writeFileSync(this.filePath, configContents);
    }

    createConfig(): T {
        return null;
    }
}
