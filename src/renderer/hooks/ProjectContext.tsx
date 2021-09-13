    import React, { createContext, FC, useContext, useState } from 'react';
import path from 'path';
import fs from 'fs';
import { ipcRenderer } from 'electron';
import { Project } from '../types/Project';

export type ProjectData = Project & { location: string }; 

type ProjectContextType = {
    loadProject: (path: string) => void;
    createProject: (name: string, path: string, instrumentsSrc: string, bundlesSrc: string, htmlUiSrc: string) => void;
    project: ProjectData | undefined;
}

export const ProjectContext = createContext<ProjectContextType>(undefined as any);
export const useProject = () => useContext(ProjectContext);

export const ProjectProvider: FC = ({ children }) => {
    const [project, setProject] = useState<ProjectData | undefined>();

    const loadProject = (location: string) => {
        if (!fs.existsSync(`${location}/.ace/project.json`)) window.alert(`Project Doesn't exist in: ${location}`);

        const project = JSON.parse(fs.readFileSync(path.join(location, '.ace/project.json'), { encoding: 'utf8' })) as Project;

        project.paths.instrumentSrc = path.join(location, project.paths.instrumentSrc);
        project.paths.bundlesSrc = path.join(location, project.paths.bundlesSrc);
        project.paths.htmlUiSrc = path.join(location, project.paths.htmlUiSrc);

        ipcRenderer.send('load-project', project.paths.htmlUiSrc);
        setProject({ ...project, location });
    };

    const createProject = async (name: string, location: string, instrumentsSrc: string, bundlesSrc: string, htmlUiSrc: string) => {
        if (fs.existsSync(`${location}/.ace/project.json`)) return;

        const project: Project = {
            name,
            paths: {
                instrumentSrc: path.relative(location, instrumentsSrc),
                bundlesSrc: path.relative(location, bundlesSrc),
                htmlUiSrc: path.relative(location, htmlUiSrc),
            },
        };

        console.log(project);
        if (!fs.existsSync(path.join(location, '.ace'))) fs.mkdirSync(path.join(location, '.ace'));
        fs.writeFileSync(path.join(location, '.ace/project.json'), JSON.stringify(project, null, "\t"));
        loadProject(location);
    };

    return (
        <ProjectContext.Provider value={{ project, loadProject, createProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
