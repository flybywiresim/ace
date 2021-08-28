import React, { createContext, FC, useContext, useState } from 'react';
import { Project } from '../types/Project';

const fs = window.require('fs');

type ProjectContextType = {
    loadProject: (path: string) => void;
    project: Project | undefined;
}
export const ProjectContext = createContext<ProjectContextType>(undefined as any);
export const useProject = () => useContext(ProjectContext);
export const ProjectProvider: FC = ({ children }) => {
    const [project, setProject] = useState<Project | undefined>();

    const loadProject = (path: string) => {
        const project = JSON.parse(fs.readFileSync(path, { encoding: 'utf8' })) as Project;
        setProject(project);
    };
    return (
        <ProjectContext.Provider value={{ project, loadProject }}>
            {children}
        </ProjectContext.Provider>
    );
};
