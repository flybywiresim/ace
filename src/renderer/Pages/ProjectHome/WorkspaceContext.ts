import React, { createContext, useContext } from 'react';
import { ProjectData } from '../../index';
import { ProjectLiveReloadHandler } from '../../Project/fs/LiveReload';
import { LiveReloadDispatcher } from '../../Project/live-reload/LiveReloadDispatcher';
import { SimVarControlsHandler } from '../../Project/fs/SimVarControlsHandler';

type WorkspaceContextType = {
    addInstrument: (instrument: string) => void;
    inInteractionMode: boolean;
    setInInteractionMode: React.Dispatch<React.SetStateAction<boolean>>;
    inEditMode: boolean;
    setInEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    project: ProjectData,
    liveReloadDispatcher: LiveReloadDispatcher,
    startLiveReload: () => void,
    handlers: {
        liveReload: ProjectLiveReloadHandler,
        simVarControls: SimVarControlsHandler,
    }
}

export const WorkspaceContext = createContext<WorkspaceContextType>(undefined as any);

export const useWorkspace = () => useContext(WorkspaceContext);
