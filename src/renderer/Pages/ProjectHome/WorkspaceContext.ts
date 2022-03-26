import { createContext, useContext } from 'react';
import { ProjectData } from '../../index';
import { ProjectLiveReloadHandler } from '../../Project/fs/LiveReload';
import { SimVarControlsHandler } from '../../Project/fs/SimVarControls';
import { SimVarPresetsHandler } from '../../Project/fs/SimVarPresets';
import { PossibleCanvasElements } from '../../../shared/types/project/canvas/CanvasSaveFile';
import { AceEngine } from '../../../../ace-engine/src/AceEngine';

type WorkspaceContextType = {
    engine: AceEngine,
    addInstrument: (instrument: string) => void;
    removeCanvasElement: (element: PossibleCanvasElements) => void;
    project: ProjectData,
    handlers: {
        liveReload: ProjectLiveReloadHandler,
        simVarControls: SimVarControlsHandler,
        simVarPresetsHandler: SimVarPresetsHandler,
    }
}

export const WorkspaceContext = createContext<WorkspaceContextType>(undefined as any);

export const useWorkspace = () => useContext(WorkspaceContext);
