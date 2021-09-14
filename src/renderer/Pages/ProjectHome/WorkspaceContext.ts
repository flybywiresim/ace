import React, { createContext, useContext } from 'react';
import { ProjectData } from '../../index';

type WorkspaceContextType = {
    addInstrument: (instrument: string) => void;
    inEditMode: boolean;
    setInEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    project: ProjectData,
}

export const WorkspaceContext = createContext<WorkspaceContextType>(undefined as any);

export const useWorkspace = () => useContext(WorkspaceContext);
