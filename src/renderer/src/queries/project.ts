import * as path from 'path';
import { ProjectData } from '../../../common/project';
import { readPanelUnsafe } from './panel';

const fs = window.require('fs');

const DEFAULT_PROJECT_PANEL_SRC = 'src/instruments';

export function createProject(name: string, directory: string, paths: {panelSrc: string}): ProjectData {
    let finalName = name;

    const packageJsonPath = `${(directory)}/package.json`;
    const directoryHasPackageJson = fs.existsSync(packageJsonPath);

    if (!finalName && !directoryHasPackageJson) {
        throw new Error('Project created without name must be in directory with a package.json');
    }

    if (!finalName) {
        const projectPackageJson = JSON.parse(fs.readFileSync(packageJsonPath).toString());

        finalName = projectPackageJson.name;

        if (!finalName) {
            throw new Error('Project created without name must have a \'name\' entry in its package.json');
        }
    }

    const def: ProjectData = {
        name: finalName,
        paths: { panelSrc: paths?.panelSrc ?? DEFAULT_PROJECT_PANEL_SRC },
    };
    return def;
}

export function readProject(directory: string): ProjectData {
    const projectFileText = fs.readFileSync(`${directory}/ace.json`).toString();
    const definition = JSON.parse(projectFileText) as ProjectData;

    const panel = readPanelUnsafe(path.join(directory, definition.paths.panelSrc));
    definition.panel = panel;
    return definition;
}
