import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { ProjectCanvasSaveHandler } from '../../Project/fs/Canvas';
import { ElementFactory } from '../../Project/canvas/ElementFactory';
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
import { useProjectDispatch } from './Store';
import { loadControls } from './Store/actions/simVarElements.actions';
import { LocalShim } from '../../shims/LocalShim';
import { setProjectData } from './Store/actions/projectData.actions';
import { AceEngine } from '../../../../ace-engine/src/AceEngine';
import { SimVarDefinition, SimVarValue } from '../../../../ace-engine/src/SimVar';
import { logActivity } from './Store/actions/timeline.actions';
import { ActivityType } from './Store/reducers/timeline.reducer';
import { addCoherentEvent, clearCoherentEvent } from './Store/actions/coherent.actions';
import { setSimVarValue } from './Store/actions/simVarValues.actions';
import { SimVarValuesHandler } from '../../Project/fs/SimVarValues';

export interface ProjectWorkspaceProps {
    project: ProjectData,
}

export const ProjectWorkspace: FC<ProjectWorkspaceProps> = ({ project }) => {
    const dispatch = useAppDispatch();
    const projectDispatch = useProjectDispatch();

    const [localShim] = useState(new LocalShim());
    const [engine] = useState(new AceEngine(localShim, {
        updateInterval: 50,
        simCallListener: {
            onSetSimVar(variable: SimVarDefinition, obtainedValue: SimVarValue) {
                projectDispatch(logActivity({
                    kind: ActivityType.SimVarSet,
                    fromInstrument: 'Unknown',
                    timestamp: new Date(),
                    variable,
                    value: obtainedValue,
                }));
            },

            onCoherentTrigger(event: string, ...args) {
                projectDispatch(logActivity({
                    kind: ActivityType.CoherentTrigger,
                    fromInstrument: 'Unknown',
                    timestamp: new Date(),
                    event,
                    args,
                }));
            },

            onCoherentCall(event: string, ...args) {
                projectDispatch(logActivity({
                    kind: ActivityType.CoherentCall,
                    fromInstrument: 'Unknown',
                    timestamp: new Date(),
                    event,
                    args,
                }));
            },

            onCoherentNewListener(data, clear) {
                projectDispatch(logActivity({
                    kind: ActivityType.CoherentNewOn,
                    fromInstrument: 'Unknown',
                    timestamp: new Date(),
                    data,
                }));
                projectDispatch(addCoherentEvent({ data, clear }));
            },

            onCoherentClearListener(data) {
                projectDispatch(logActivity({
                    kind: ActivityType.CoherentClearOn,
                    fromInstrument: 'Unknown',
                    timestamp: new Date(),
                    data,
                }));
                projectDispatch(clearCoherentEvent(data.uuid));
            },

            onSetStoredData(key: string, setValue: string) {
                projectDispatch(logActivity({
                    kind: ActivityType.DataStorageSet,
                    fromInstrument: 'Unknown',
                    timestamp: new Date(),
                    key,
                    value: setValue,
                }));
            },
        },
    }));

    const [inInteractionMode, setInInteractionMode] = useState(false);

    useChangeDebounce(() => {
        dispatch(pushNotification(`Interaction Mode: ${inInteractionMode ? 'ON' : 'OFF'}`));
    }, 500, [inInteractionMode]);

    useEffect(() => {
        const handler = (ev: KeyboardEvent) => {
            if (ev.key.toUpperCase() === 'ENTER') {
                setInInteractionMode((old) => !old);
            }
        };

        window.addEventListener('keydown', handler, true);

        return () => window.removeEventListener('keydown', handler);
    }, []);

    const doLoadProjectCanvasSave = useCallback(() => {
        const canvasSave = ProjectCanvasSaveHandler.loadCanvas(project);

        setCanvasElements(canvasSave.elements);
    }, [project]);

    const [canvasElements, setCanvasElements] = useState<PossibleCanvasElements[]>([]);

    useEffect(() => {
        if (project) {
            doLoadProjectCanvasSave();
        }
    }, [doLoadProjectCanvasSave, project]);

    const handleAddInstrument = (instrument: string) => {
        const newInstrumentPanel = ElementFactory.newInstrumentPanel({
            title: instrument,
            instrumentName: instrument,
            position: {
                x: 0,
                y: 0,
            },
        });

        setCanvasElements((old) => [...old, newInstrumentPanel]);
        ProjectCanvasSaveHandler.addElement(project, newInstrumentPanel);
    };

    const handleDeleteCanvasElement = (element: PossibleCanvasElements) => {
        setCanvasElements((old) => old.filter((el) => el.__uuid !== element.__uuid));

        ProjectCanvasSaveHandler.removeElement(project, element);
    };

    const handleUpdateCanvasElement = (element: PossibleCanvasElements) => {
        const savedElement = canvasElements.find((it) => it.__uuid === element.__uuid);

        for (const [k, v] of Object.entries(element)) {
            (savedElement as Record<string, any>)[k] = v;
        }

        ProjectCanvasSaveHandler.updateElement(project, element);
    };

    const [liveReloadConfigHandler, setLiveReloadConfigHandler] = useState<ProjectLiveReloadHandler>(null);
    const [liveReloadDispatcher, setLiveReloadDispatcher] = useState<LiveReloadDispatcher>(null);

    const liveReloadDispatcherRef = useRef<LiveReloadDispatcher>(null);

    useEffect(() => {
        liveReloadDispatcherRef.current = liveReloadDispatcher;
    }, [liveReloadDispatcher]);

    const [simVarControlsHandler, setSimVarControlsHandler] = useState<SimVarControlsHandler>(null);
    const [simVarValuesHandler, setSimVarValuesHandler] = useState<SimVarValuesHandler>(null);
    const [simVarPresetsHandler, setSimVarPresetsHandler] = useState<SimVarPresetsHandler>(null);

    useEffect(() => {
        if (project) {
            setLiveReloadConfigHandler(new ProjectLiveReloadHandler(project));

            setLiveReloadDispatcher((old) => {
                old?.stopWatching();

                return new LiveReloadDispatcher(project);
            });

            setSimVarControlsHandler(new SimVarControlsHandler(project));
            setSimVarValuesHandler(new SimVarValuesHandler(project));
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

    useEffect(() => {
        if (simVarValuesHandler) {
            const entries = simVarValuesHandler.loadConfig()?.elements;

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
        }
    }, [projectDispatch, simVarValuesHandler]);

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
            inInteractionMode,
            setInInteractionMode,
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
                                                onUpdate={handleUpdateCanvasElement}
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
