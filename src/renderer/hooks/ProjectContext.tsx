import React, { createContext, FC, useContext, useState } from 'react';
import path from 'path';
import fs from 'fs';
import { Project } from '../types/Project';
import { ipcRenderer } from 'electron';

type ProjectContextType = {
    loadProject: (path: string) => void;
    createProject: (name: string, path: string, instrumentsSrc: string, bundlesSrc: string, htmlUiSrc: string) => void;
    project: Project | undefined;
}

export const ProjectContext = createContext<ProjectContextType>(undefined as any);
export const useProject = () => useContext(ProjectContext);

export const ProjectProvider: FC = ({ children }) => {
    const [project, setProject] = useState<Project | undefined>();

    const loadProject = (location: string) => {
        if (!fs.existsSync(`${location}/.ace/project.json`)) window.alert(`Project Doesn't exist in: ${location}`);

        const project = JSON.parse(fs.readFileSync(path.join(location, '.ace/project.json'), { encoding: 'utf8' })) as Project;
        ipcRenderer.send('load-project', path.join(project.paths.project, project.paths.htmlUiSrc));
        setProject(project);
    };

    const createProject = async (name: string, location: string, instrumentsSrc: string, bundlesSrc: string, htmlUiSrc: string) => {
        if (fs.existsSync(`${location}/.ace/project.json`)) return;

        const project: Project = {
            name,
            paths: {
                instrumentSrc: path.relative(location, instrumentsSrc),
                bundlesSrc: path.relative(location, bundlesSrc),
                htmlUiSrc: path.relative(location, htmlUiSrc),
                project: location,
            },
        };

        console.log(project);
        if (!fs.existsSync(path.join(location, '.ace'))) fs.mkdirSync(path.join(location, '.ace'));
        fs.writeFileSync(path.join(location, '.ace/project.json'), JSON.stringify(project));
        loadProject(location);
    };

    return (
        <ProjectContext.Provider value={{ project, loadProject, createProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
