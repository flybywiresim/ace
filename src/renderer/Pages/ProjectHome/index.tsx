import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { ProjectCanvasSaveHandler } from '../../Project/fs/Canvas';
import { CanvasElementFactory } from '../../Project/canvas/ElementFactory';
import { PossibleCanvasElements } from '../../../shared/types/project/canvas/CanvasSaveFile';
import { InteractionToolbar } from './InteractionToolbar';
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
    }, [project]);

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
            if (event.key.toUpperCase() === 'SHIFT') {
                setShift(true);
            }
            if (event.key.toUpperCase() === 'CONTROL') {
                setControl(true);
            }
            if (event.key.toUpperCase() === 'ENTER') {
                setInInteractionMode((old) => !old);
            }
            if (event.key.toUpperCase() === 'DELETE') {
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

    function handleElementClick(element: PossibleCanvasElements) {
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
            setLiveReloadDispatcher(new LiveReloadDispatcher(project));

            setSimVarControlsHandler(new SimVarControlsHandler(project));
        }
    }, [project]);

    const startLiveReload = useCallback(() => {
        if (liveReloadDispatcher) {
            liveReloadDispatcher.startWatching();
        }
    }, [liveReloadDispatcher]);

    return (
        <WorkspaceContext.Provider value={{
            addInstrument: handleAddInstrument,
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

                    <div className="relative w-full h-full z-30">
                        <PanelCanvas render={({ zoom }) => (
                            <>
                                <Grid />

                                {canvasElements.map((canvasElement) => {
                                    if (canvasElement.__kind === 'instrument') {
                                        return (
                                            <div onClick={() => handleElementClick(canvasElement)}>
                                                <InstrumentFrameElement
                                                    key={canvasElement.title}
                                                    instrumentFrame={canvasElement}
                                                    zoom={zoom}
                                                    onDelete={() => handleDeleteCanvasElement(canvasElement)}
                                                    onUpdate={handleUpdateCanvasElement}
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
