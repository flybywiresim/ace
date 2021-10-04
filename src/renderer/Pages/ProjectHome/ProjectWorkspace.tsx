import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { ProjectCanvasSaveHandler } from '../../Project/fs/Canvas';
import { CanvasElementFactory } from '../../Project/canvas/ElementFactory';
import { PossibleCanvasElements } from '../../../shared/types/project/canvas/CanvasSaveFile';
import { InteractionToolbar } from './Components/InteractionToolbar';
import { PanelCanvas } from '../PanelCanvas';
import { InstrumentFrameElement } from '../Canvas/InstrumentFrameElement';
import { useProjects } from '../..';
import { WorkspaceContext } from './WorkspaceContext';
import { ProjectLiveReloadHandler } from '../../Project/fs/LiveReload';
import { LiveReloadDispatcher } from '../../Project/live-reload/LiveReloadDispatcher';
import { Grid } from '../Canvas/Grid';
import { useAppDispatch } from '../../Store';
import { pushNotification } from '../../Store/actions/notifications.actions';
import { useChangeDebounce } from '../../Hooks/useDebounceEffect';
import { SimVarControlsHandler } from '../../Project/fs/SimVarControlsHandler';
import { CanvasContextMenu } from './Components/CanvasContextMenu';

export const ProjectWorkspace = () => {
    const { name } = useParams<{ name: string }>();
    const project = useProjects().projects.find((project) => project.name === name);

    const [inInteractionMode, setInInteractionMode] = useState(false);

    const [shift, setShift] = useState(false);
    const [control, setControl] = useState(false);

    const [canvasElements, setCanvasElements] = useState<PossibleCanvasElements[]>([]);
    const [selectedCanvasElements, setSelectedCanvasElements] = useState<PossibleCanvasElements[]>([]);

    const dispatch = useAppDispatch();

    useChangeDebounce(() => {
        dispatch(pushNotification(`Interaction Mode: ${inInteractionMode ? 'ON' : 'OFF'}`));
    }, 500, [inInteractionMode]);

    const [inEditMode, setInEditMode] = useState(false);

    const doLoadProjectCanvasSave = useCallback(() => {
        const canvasSave = ProjectCanvasSaveHandler.loadCanvas(project);

        setCanvasElements(canvasSave.elements);
    }, [project]);

    useEffect(() => {
        if (project) {
            doLoadProjectCanvasSave();
        }
    }, [doLoadProjectCanvasSave, project]);

    const handleAddInstrument = (instrument: string) => {
        const newInstrumentPanel = CanvasElementFactory.newInstrumentPanel({
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

    function tryAddElementToSelected(addition: PossibleCanvasElements) {
        if (!selectedCanvasElements.includes(addition)) {
            setSelectedCanvasElements((canvasElements) => [...canvasElements, addition]);
        }
    }

    useEffect(() => {
        function downHandler(event: KeyboardEvent) {
            const k = event.key.toUpperCase();

            if (k === 'SHIFT') {
                setShift(true);
            }
            if (k === 'CONTROL') {
                setControl(true);
            }
            if (k === 'ENTER') {
                setInInteractionMode((old) => !old);
            }
            if (k === 'DELETE' || k === 'BACKSPACE') {
                for (const element of selectedCanvasElements) {
                    handleDeleteCanvasElement(element);
                }
            }
        }

        function upHandler(event:KeyboardEvent) {
            if (event.key.toUpperCase() === 'SHIFT') {
                setShift(false);
            }
            if (event.key.toUpperCase() === 'CONTROL') {
                setControl(false);
            }
        }

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);

        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [selectedCanvasElements]);

    function handleElementClick(element: PossibleCanvasElements, event: React.MouseEvent) {
        if (event.button === 0) {
            setContextMenuOpen(false);
        }

        if (shift) {
            tryAddElementToSelected(element);
        } else {
            setSelectedCanvasElements([element]);
        }
    }
    const [simVarControlsHandler, setSimVarControlsHandler] = useState<SimVarControlsHandler>(null);

    useEffect(() => {
        if (project) {
            setLiveReloadConfigHandler(new ProjectLiveReloadHandler(project));

            setLiveReloadDispatcher((old) => {
                old?.stopWatching();

                return new LiveReloadDispatcher(project);
            });

            setSimVarControlsHandler(new SimVarControlsHandler(project));
        }
    }, [project]);

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

        if (e.button === 0) {
            setSelectedCanvasElements([]);
            e.stopPropagation();
        }

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
            addInstrument: handleAddInstrument,
            removeCanvasElement: handleDeleteCanvasElement,
            project,
            inEditMode,
            inInteractionMode,
            setInInteractionMode,
            setInEditMode,
            liveReloadDispatcher,
            startLiveReload,
            handlers: {
                liveReload: liveReloadConfigHandler,
                simVarControls: simVarControlsHandler,
            },
        }}
        >
            {project && (
                <div className="w-full h-full flex overflow-hidden">
                    <div className="absolute z-40 p-7">
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
                                            <div onClick={(event) => handleElementClick(canvasElement, event)}>
                                                <InstrumentFrameElement
                                                    key={canvasElement.__uuid}
                                                    instrumentFrame={canvasElement}
                                                    zoom={zoom}
                                                    onUpdate={handleUpdateCanvasElement}
                                                    selected={selectedCanvasElements.includes(canvasElement)}
                                                />
                                            </div>
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
