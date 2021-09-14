import React, { useCallback, useEffect, useState } from 'react';
import { useProject } from '../../hooks/ProjectContext';
import { ProjectCanvasSaveHandler } from '../../Project/fs/Canvas';
import { ProjectInstrumentsHandler } from '../../Project/fs/Instruments';
import { CanvasElementFactory } from '../../Project/canvas/ElementFactory';
import { PossibleCanvasElements } from '../../../shared/types/project/canvas/CanvasSaveFile';
import { Workspace } from '../Workspace';

export const Project = () => {
    const { project } = useProject();

    const doLoadProjectCanvasSave = useCallback(() => {
        const canvasSave = ProjectCanvasSaveHandler.loadCanvas(project);

        setCanvasElements(canvasSave.elements);
    }, [project]);

    const [availableInstruments, setAvailableInstruments] = useState<string[]>([]);
    const [canvasElements, setCanvasElements] = useState<PossibleCanvasElements[]>([]);

    useEffect(() => {
        if (project) {
            doLoadProjectCanvasSave();
        }
    }, [project]);

    useEffect(() => {
        if (project) {
            setAvailableInstruments(ProjectInstrumentsHandler.loadAllInstruments(project).map((instrument) => instrument.config.name));
        } else {
            setAvailableInstruments([]);
        }
    }, [project]);

    const handleDeleteCanvasElement = (element: PossibleCanvasElements) => {
        setCanvasElements((old) => old.filter((el) => el.__uuid !== element.__uuid));

        ProjectCanvasSaveHandler.removeElement(project, element);
    };

    return (
        <div className="w-full h-full flex">
            <div className="w-72 flex flex-col p-5">
                <div className="mt-4">
                    {availableInstruments.map((instrument) => (
                        <button
                            type="button"
                            onClick={() => {
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
                            }}
                        >
                            {instrument}
                        </button>
                    ))}
                </div>
            </div>

            <Workspace canvasElements={canvasElements} onDeleteCanvasElement={handleDeleteCanvasElement} />
        </div>
    );
};
