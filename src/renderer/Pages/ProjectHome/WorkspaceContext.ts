import React, { createContext, useContext } from 'react';
import { ProjectData } from '../../index';
import { ProjectLiveReloadHandler } from '../../Project/fs/LiveReload';
import { LiveReloadDispatcher } from '../../Project/live-reload/LiveReloadDispatcher';
import { SimVarControlsHandler } from '../../Project/fs/SimVarControls';
import { SimVarPresetsHandler } from '../../Project/fs/SimVarPresets';
import { PossibleCanvasElements } from '../../../shared/types/project/canvas/CanvasSaveFile';
import { LocalShim } from '../../shims/LocalShim';

type WorkspaceContextType = {
    addInstrument: (instrument: string) => void;
    removeCanvasElement: (element: PossibleCanvasElements) => void;
    inInteractionMode: boolean;
    setInInteractionMode: React.Dispatch<React.SetStateAction<boolean>>;
    inEditMode: boolean;
    setInEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    project: ProjectData,
    liveReloadDispatcher: LiveReloadDispatcher,
    startLiveReload: () => void,
    localShim: LocalShim;
    handlers: {
        liveReload: ProjectLiveReloadHandler,
        simVarControls: SimVarControlsHandler,
        simVarPresetsHandler: SimVarPresetsHandler,
    }
}

export const WorkspaceContext = createContext<WorkspaceContextType>(undefined as any);

export const useWorkspace = () => useContext(WorkspaceContext);
