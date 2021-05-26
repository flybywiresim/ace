import * as fs from 'fs';
import { ProjectCreationParams, ProjectData, ProjectDef, ProjectLoadingParams } from '../common/project';
import { readPanel } from './panel';

export function validateProjectLoading({ directory }: ProjectLoadingParams): string | true {
    if (directory) {
        if (!fs.existsSync(directory)) {
            return 'Project directory does not exixt';
        }

        if (!fs.existsSync(`${directory}/.ace`)) {
            return 'Project does not exist at location';
        }

        return true;
    }

    return 'Project loading parameters must include directory';
}

export function loadProject({ directory }: ProjectLoadingParams): ProjectData {
    const projectFileText = fs.readFileSync(`${directory}/.ace/project.json`).toString();
    const definition = JSON.parse(projectFileText) as ProjectDef;

    const panel = readPanel(`${directory}/flybywire-aircraft-a320-neo/SimObjects/AirPlanes/FlyByWire_A320_NEO/panel/panel.cfg`);

    return { definition, panel };
}

export function validateProjectCreation({ directory }: ProjectCreationParams): string | true {
    if (directory) {
        if (!fs.existsSync(directory)) {
            return 'Project directory does not exixt';
        }

        if (fs.existsSync(`${directory}/.ace`)) {
            return 'Project already exists at location';
        }

        return true;
    }

    return 'Project creation parameters must include directory';
}

export function createProject({ name: finalName, directory }: ProjectCreationParams): ProjectDef {
    if (fs.existsSync(`${directory}/.ace`)) {
        throw new Error('Project already exists at location');
    }

    const packageJsonPath = `${directory}/package.json`;

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

    const def: ProjectDef = {
        name: finalName,
        createdAt: Date.now(),
    };

    writeProjectFile(directory, def);

    return def;
}

function writeProjectFile(directory: string, def: ProjectDef): void {
    const projectFilePath = `${directory}/.ace/project.json`;

    if (!fs.existsSync(`${directory}/.ace/`)) {
        fs.mkdirSync(`${directory}/.ace/`);
    }

    fs.writeFileSync(projectFilePath, JSON.stringify(def, null, 4));
}
