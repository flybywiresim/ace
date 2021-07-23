import React, { FC, PropsWithChildren, useContext, useState} from 'react';

import { ProjectData } from '../../../common/project';

export type ProjectContextType = {
    loadedProject: ProjectData | null,
    setLoadedProject: (project: ProjectData | null) => void,
}
export const ProjectContext = React.createContext<ProjectContextType>(undefined as any);

export const useProjectContext = (): ProjectContextType => useContext(ProjectContext);

export const ProjectProvider: FC<PropsWithChildren<any>> = ({ children }) => {
    const [loadedProject, setLoadedProject] = useState<ProjectData>(null);

    return (
        <ProjectContext.Provider value={{ loadedProject, setLoadedProject }}>
            {children}
        </ProjectContext.Provider>
    );
}