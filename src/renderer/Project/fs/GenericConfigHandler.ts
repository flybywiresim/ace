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

        function checkMissingValues(baseConfig: T): string[] {
            const missingVals: string[] = [];

            if (!baseConfig) {
                return missingVals;
            }

            const configObjKeys = Object.keys(configObject);

            Object.keys(baseConfig).forEach((key) => {
                if (!configObjKeys.includes(key)) {
                    missingVals.push(key);
                }
            });

            return missingVals;
        }

        function checkConfigExtras(baseConfig: T): string[] {
            const extras: string[] = [];

            if (!baseConfig) {
                return extras;
            }

            const baseConfigObjKeys = Object.keys(baseConfig);

            Object.keys(configObject).forEach((key) => {
                if (!baseConfigObjKeys.includes(key)) {
                    extras.push(key);
                }
            });

            return extras;
        }

        if (checkMissingValues(this.createConfig()).length) {
            checkMissingValues(this.createConfig()).forEach((missingValue) => {
                configObject[missingValue as keyof T] = this.createConfig()[missingValue as keyof T];
            });
            this.saveConfig(configObject);
        }

        if (checkConfigExtras(this.createConfig()).length) {
            checkConfigExtras(this.createConfig()).forEach((extra) => {
                delete configObject[extra as keyof T];
                this.saveConfig(configObject);
            });
            this.saveConfig(configObject);
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
