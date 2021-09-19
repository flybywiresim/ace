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

export const ProjectWorkspace = () => {
    const { name } = useParams<{ name: string }>();
    const project = useProjects().projects.find((project) => project.name === name);

    const [inInteractionMode, setInInteractionMode] = useState(false);

    useEffect(() => {
        const handler = (ev: KeyboardEvent) => {
            if (ev.key.toUpperCase() === 'ENTER') {
                setInInteractionMode((old) => !old);
            }
        };

        window.addEventListener('keydown', handler, true);

        return () => window.removeEventListener('keydown', handler);
    }, []);

    const [inEditMode, setInEditMode] = useState(false);

    const doLoadProjectCanvasSave = useCallback(() => {
        const canvasSave = ProjectCanvasSaveHandler.loadCanvas(project);

        setCanvasElements(canvasSave.elements);
    }, [project]);

    const [canvasElements, setCanvasElements] = useState<PossibleCanvasElements[]>([]);

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

    useEffect(() => {
        if (project) {
            setLiveReloadConfigHandler(new ProjectLiveReloadHandler(project));
            setLiveReloadDispatcher(new LiveReloadDispatcher(project));
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
            handlers: { liveReload: liveReloadConfigHandler },
        }}
        >
            {project && (
                <div className="w-full h-full flex overflow-hidden">
                    <div className="absolute z-50 p-7">
                        <InteractionToolbar />
                    </div>

                    <div className="relative w-full h-full z-40">
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
                                                onDelete={() => handleDeleteCanvasElement(canvasElement)}
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
