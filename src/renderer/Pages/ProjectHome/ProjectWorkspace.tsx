import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { ProjectCanvasSaveHandler } from '../../Project/fs/Canvas';
import { PossibleCanvasElements } from '../../../shared/types/project/canvas/CanvasSaveFile';
import { InteractionToolbar } from './Components/InteractionToolbar';
import { PanelCanvas } from '../PanelCanvas';
import { InstrumentFrameElement } from '../Canvas/InstrumentFrameElement';
import { ProjectData } from '../..';
import { WorkspaceContext } from './WorkspaceContext';
import { ProjectLiveReloadHandler } from '../../Project/fs/LiveReload';
import { LiveReloadDispatcher } from '../../Project/live-reload/LiveReloadDispatcher';
import { Grid } from '../Canvas/Grid';
import { useAppDispatch } from '../../Store';
import { pushNotification } from '../../Store/actions/notifications.actions';
import { useChangeDebounce } from '../../Hooks/useDebounceEffect';
import { SimVarControlsHandler } from '../../Project/fs/SimVarControls';
import { CanvasContextMenu } from './Components/CanvasContextMenu';
import { SimVarPresetsHandler } from '../../Project/fs/SimVarPresets';
import { useProjectDispatch, useProjectSelector } from './Store';
import { loadControls } from './Store/actions/simVarElements.actions';
import { LocalShim } from '../../shims/LocalShim';
import { setProjectData } from './Store/actions/projectData.actions';
import { AceEngine } from '../../../../ace-engine/src/AceEngine';
import { logActivity } from './Store/actions/timeline.actions';
import { ActivityType } from './Store/reducers/timeline.reducer';
import { addCoherentEvent, clearCoherentEvent } from './Store/actions/coherent.actions';
import { setSimVarValue } from './Store/actions/simVarValues.actions';
import { SimVarValuesHandler } from '../../Project/fs/SimVarValues';
import {
    addCanvasElement,
    loadCanvasElements,
    removeCanvasElement,
} from './Store/actions/canvas.actions';
import { CockpitPanelElement } from '../Canvas/CockpitPanel/CockpitPanelElement';
import { InstrumentFrame } from '../../../shared/types/project/canvas/InstrumentFrame';
import { PersistentStorageHandler } from '../../Project/fs/PersistentStorageHandler';
import { setPersistentValue } from './Store/actions/persistentStorage.actions';
import useInterval from '../../../utils/useInterval';
import { QueuedDataWriter } from './QueuedDataWriter';
import { reset } from './Store/actions/global.actions';
import { RemoteShim } from '../../../../ace-remote-bridge/src/RemoteShim';
import { RemoteBridgeAceClient } from '../../../../ace-remote-bridge/src/RemoteBridgeAceClient';
import { setInteractionMode } from './Store/actions/interaction.actions';

export interface ProjectWorkspaceProps {
    project: ProjectData,
}

export const ProjectWorkspace: FC<ProjectWorkspaceProps> = ({ project }) => {
    const dispatch = useAppDispatch();
    const projectDispatch = useProjectDispatch();

    const [localShim] = useState(new RemoteShim(new RemoteBridgeAceClient()));

    useEffect(() => {
        localShim.client.connect('ws://10.0.0.200:8086/interfaces/remote-bridge');
    }, [localShim]);

    const [engine] = useState(new AceEngine(localShim, {
        updateInterval: 50,
        simCallListener: {
            onSetSimVar(variable, obtainedValue, instrumentUniqueID) {
                projectDispatch(logActivity({
                    kind: ActivityType.SimVarSet,
                    instrumentUniqueID,
                    timestamp: new Date(),
                    variable,
                    value: obtainedValue,
                }));
            },

            onCoherentCall(event, args, instrumentUniqueID) {
                projectDispatch(logActivity({
                    kind: ActivityType.CoherentCall,
                    instrumentUniqueID,
                    timestamp: new Date(),
                    event,
                    args,
                }));
            },

            onCoherentNewListener(data, clear, instrumentUniqueID) {
                const dataWithoutCallback: any = { ...data };

                dataWithoutCallback.callback = undefined;

                projectDispatch(logActivity({
                    kind: ActivityType.CoherentNewOn,
                    instrumentUniqueID,
                    timestamp: new Date(),
                    data: dataWithoutCallback,
                }));
                projectDispatch(addCoherentEvent({ data, clear }));
            },

            onCoherentClearListener(data, instrumentUniqueID) {
                const dataWithoutCallback: any = { ...data };

                dataWithoutCallback.callback = undefined;

                projectDispatch(logActivity({
                    kind: ActivityType.CoherentClearOn,
                    instrumentUniqueID,
                    timestamp: new Date(),
                    data: dataWithoutCallback,
                }));
                projectDispatch(clearCoherentEvent(data.uuid));
            },

            onCoherentTrigger(event, args, instrumentUniqueID) {
                projectDispatch(logActivity({
                    kind: ActivityType.CoherentTrigger,
                    instrumentUniqueID,
                    timestamp: new Date(),
                    event,
                    args,
                }));
            },

            onSetStoredData(key, setValue, instrumentUniqueID) {
                projectDispatch(logActivity({
                    kind: ActivityType.DataStorageSet,
                    instrumentUniqueID,
                    timestamp: new Date(),
                    key,
                    value: setValue,
                }));
            },
        },
    }));

    const inInteractionMode = useProjectSelector((state) => state.interaction.inInteractionMode);

    useChangeDebounce(() => {
        dispatch(pushNotification(`Interaction Mode: ${inInteractionMode ? 'ON' : 'OFF'}`));
    }, 500, [inInteractionMode]);

    useInterval(() => {
        QueuedDataWriter.flush();
    }, 1_000);

    useEffect(() => {
        const handler = (ev: KeyboardEvent) => {
            if (ev.key.toUpperCase() === 'ENTER') {
                projectDispatch(setInteractionMode(!inInteractionMode));
            }
        };

        window.addEventListener('keydown', handler, true);

        return () => window.removeEventListener('keydown', handler);
    }, [inInteractionMode, projectDispatch]);

    const doLoadProjectCanvasSave = useCallback(() => {
        const canvasSave = ProjectCanvasSaveHandler.loadCanvas(project);

        projectDispatch(loadCanvasElements(canvasSave.elements));
    }, [project]);

    const canvasElements = useProjectSelector((state) => state.canvas.elements);

    useEffect(() => {
        if (project) {
            QueuedDataWriter.discard();

            projectDispatch(reset());

            doLoadProjectCanvasSave();
        }

        return () => QueuedDataWriter.flush();
    }, [project, projectDispatch, doLoadProjectCanvasSave]);

    const handleAddInstrument = (instrument: string) => {
        const newInstrumentPanel: InstrumentFrame = {
            __uuid: v4(),
            __kind: 'instrument',
            dataKind: 'bundled',
            title: instrument,
            instrumentName: instrument,
            position: {
                x: 0,
                y: 0,
            },
        };

        projectDispatch(addCanvasElement(newInstrumentPanel));
    };

    const handleDeleteCanvasElement = (element: PossibleCanvasElements) => {
        projectDispatch(removeCanvasElement(element.__uuid));
    };

    const [liveReloadConfigHandler, setLiveReloadConfigHandler] = useState<ProjectLiveReloadHandler>(null);
    const [liveReloadDispatcher, setLiveReloadDispatcher] = useState<LiveReloadDispatcher>(null);

    const liveReloadDispatcherRef = useRef<LiveReloadDispatcher>(null);

    useEffect(() => {
        liveReloadDispatcherRef.current = liveReloadDispatcher;
    }, [liveReloadDispatcher]);

    const [simVarControlsHandler, setSimVarControlsHandler] = useState<SimVarControlsHandler>(null);
    const [persistentStorageHandler, setPersistentStorageHandler] = useState<PersistentStorageHandler>(null);
    const [simVarPresetsHandler, setSimVarPresetsHandler] = useState<SimVarPresetsHandler>(null);

    useEffect(() => {
        if (project) {
            setLiveReloadConfigHandler(new ProjectLiveReloadHandler(project));

            setLiveReloadDispatcher((old) => {
                old?.stopWatching();

                return new LiveReloadDispatcher(project);
            });

            setSimVarControlsHandler(new SimVarControlsHandler(project));
            setPersistentStorageHandler(new PersistentStorageHandler(project));
            setSimVarPresetsHandler(new SimVarPresetsHandler(project));
        }

        return () => {
            liveReloadDispatcherRef.current?.stopWatching();
        };
    }, [project]);

    useEffect(() => {
        projectDispatch(setProjectData(project));
    }, [project, projectDispatch]);

    useEffect(() => {
        if (simVarControlsHandler) {
            const controls = simVarControlsHandler.loadConfig()?.elements;

            if (controls) {
                projectDispatch(loadControls(controls));
            } else {
                throw new Error('[ProjectWorkspace] Could not load simvar controls from handler.');
            }
        }
    }, [projectDispatch, simVarControlsHandler]);

    // Load cached SimVar values
    useEffect(() => {
        const entries = new SimVarValuesHandler(project).loadConfig()?.elements;

        if (entries) {
            for (const { value, variable } of entries) {
                projectDispatch(setSimVarValue(
                    {
                        variable,
                        value,
                    },
                ));
            }
        }
    }, [project, projectDispatch]);

    // Load cached persistent properties
    useEffect(() => {
        if (persistentStorageHandler) {
            const entries = persistentStorageHandler.loadConfig()?.data;

            if (entries) {
                for (const entry of Object.entries(entries)) {
                    projectDispatch(setPersistentValue(entry));
                }
            }
        }
    }, [projectDispatch, persistentStorageHandler]);

    const startLiveReload = useCallback(() => {
        if (liveReloadDispatcher) {
            if (liveReloadDispatcher.started) {
                liveReloadDispatcher.stopWatching();
            }
            liveReloadDispatcher.startWatching();
        }
    }, [liveReloadDispatcher]);

    const contextMenuRef = useRef<HTMLDivElement>(null);
    const [contextMenuTarget, setContextMenuTarget] = useState<PossibleCanvasElements>(null);
    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuX, setContextMenuX] = useState(0);
    const [contextMenuY, setContextMenuY] = useState(0);

    const handleCanvasClick = (e: React.MouseEvent) => {
        setContextMenuOpen((old) => {
            if (old) {
                return false;
            }

            return e.button === 2;
        });

        if (e.button === 2) {
            let x: number;
            let y: number;

            if (contextMenuRef.current.firstElementChild) {
                x = e.clientX >= window.innerWidth - contextMenuRef.current.firstElementChild.clientWidth
                    ? e.clientX - contextMenuRef.current.firstElementChild.clientWidth
                    : e.clientX;
                y = e.clientY >= window.innerHeight - contextMenuRef.current.firstElementChild.clientHeight
                    ? e.clientY - contextMenuRef.current.firstElementChild.clientHeight
                    : e.clientY;
            } else {
                x = e.clientX + 25;
                y = e.clientY - 40;
            }

            setContextMenuX(x);
            setContextMenuY(y);
            setContextMenuTarget((e as any).canvasTarget ?? null);
        }

        return false;
    };

    return (
        <WorkspaceContext.Provider value={{
            engine,
            addInstrument: handleAddInstrument,
            removeCanvasElement: handleDeleteCanvasElement,
            project,
            liveReloadDispatcher,
            startLiveReload,
            handlers: {
                liveReload: liveReloadConfigHandler,
                simVarControls: simVarControlsHandler,
                simVarPresetsHandler,
            },
        }}
        >
            {project && (
                <div className="w-full h-full flex overflow-hidden">
                    <div className="absolute z-40 p-7" style={{ height: 'calc(100% - 3rem)' }}>
                        <InteractionToolbar />
                    </div>

                    <div className="relative w-full h-full z-30" onMouseDown={handleCanvasClick}>
                        <div ref={contextMenuRef}>
                            <CanvasContextMenu
                                rightClickedElement={contextMenuTarget}
                                open={contextMenuOpen}
                                x={contextMenuX}
                                y={contextMenuY}
                            />
                        </div>

                        <PanelCanvas render={({ zoom }) => (
                            <>
                                <Grid />

                                {canvasElements.map((canvasElement) => {
                                    if (canvasElement.__kind === 'instrument') {
                                        return (
                                            <InstrumentFrameElement
                                                key={canvasElement.title}
                                                instrumentFrame={canvasElement}
                                                zoom={zoom}
                                            />
                                        );
                                    } if (canvasElement.__kind === 'cockpit-panel') {
                                        return (
                                            <CockpitPanelElement
                                                panel={canvasElement}
                                                canvasZoom={zoom}
                                            />
                                        );
                                    }
                                    return null;
                                })}
                            </>
                        )}
                        />
                    </div>
                </div>
            )}
        </WorkspaceContext.Provider>
    );
};
