import fs from 'fs';

export const isProjectFolderSuitable = (projectFolder: string): boolean => {
    if (fs.existsSync(`${projectFolder}/.ace/project.json`)) {
        window.alert(`Project Already Exists in: ${projectFolder}`);
        return false;
    }
    if (!fs.existsSync(`${projectFolder}/package.json`)) {
        window.alert(`No package.json found in: ${projectFolder}`);
        return false;
    }
    return true;
};

export const isInstrumentsFolderSuitable = (instruments: string, projectFolder: string): boolean => {
    if (!instruments.includes(projectFolder)) {
        window.alert(`Selected Folder is not inside Project folder: ${projectFolder}`);
        return false;
    }
    return true;
};
