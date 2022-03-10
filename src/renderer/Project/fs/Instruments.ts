import path from 'path';
import fs from 'fs';
import { Instrument, InstrumentConfig, InstrumentFile } from '../../Pages/Canvas/InstrumentFrameElement';
import { Project } from '../../types/Project';

export class ProjectInstrumentsHandler {
    public static loadAllInstruments(project: Project): Instrument[] {
        const instrumentFolders = fs.readdirSync(project.paths.instrumentSrc, { withFileTypes: true })
            .filter((ent) => ent.isDirectory())
            .filter((ent) => fs.existsSync(path.join(project.paths.instrumentSrc, ent.name, 'config.json')))
            .map((ent) => path.basename(ent.name));

        return instrumentFolders.map((instrumentFolder) => ProjectInstrumentsHandler.loadInstrumentByName(project, instrumentFolder));
    }

    public static loadInstrumentByName(project: Project, name: string): Instrument {
        const instrumentSourceFolder = path.join(project.paths.instrumentSrc, name);

        if (!fs.existsSync(instrumentSourceFolder)) {
            throw new Error(`[ProjectInstrumentsHandler] Cannot find '${instrumentSourceFolder}'.`);
        }

        const config = ProjectInstrumentsHandler.loadInstrumentConfig(instrumentSourceFolder);

        if (!config.name) {
            config.name = name;
        }

        if (!config.dimensions) {
            config.dimensions = {
                width: 768,
                height: 768,
            };
        }

        if (!config.searchParams) {
            config.searchParams = 'Index=1';
        }

        const instrumentBundlesFolder = path.join(project.paths.bundlesSrc, name);

        if (!fs.existsSync(instrumentBundlesFolder)) {
            throw new Error(`[ProjectInstrumentsHandler] Cannot find '${instrumentBundlesFolder}'.`);
        }

        const files = ProjectInstrumentsHandler.loadInstrumentFiles(instrumentBundlesFolder);

        return {
            config,
            files,
        };
    }

    private static loadInstrumentConfig(instrumentSourcesPath: string): InstrumentConfig {
        const instrumentConfigFile = path.join(instrumentSourcesPath, 'config.json');

        if (!fs.existsSync(instrumentConfigFile)) {
            throw new Error(`[ProjectInstrumentsHandler] Cannot find '${instrumentConfigFile}'.`);
        }

        const instrumentConfigContents = fs.readFileSync(instrumentConfigFile).toString();

        return JSON.parse(instrumentConfigContents) as InstrumentConfig;
    }

    private static loadInstrumentFiles(instrumentBundlesPath: string): InstrumentFile[] {
        const filesInBundlesFolder = fs.readdirSync(instrumentBundlesPath, { withFileTypes: true });

        return filesInBundlesFolder.map((ent) => ({
            name: ent.name,
            path: path.join(instrumentBundlesPath, ent.name),
            contents: fs.readFileSync(path.join(instrumentBundlesPath, ent.name)).toString(),
        }));
    }
}
