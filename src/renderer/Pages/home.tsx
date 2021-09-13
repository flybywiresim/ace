import React, { useCallback, useEffect, useState } from 'react';
import { remote } from 'electron';
import { useHistory } from 'react-router-dom';
import { useProject } from '../hooks/ProjectContext';
import { PanelCanvas } from './PanelCanvas';
import { InstrumentFrameElement } from './Canvas/InstrumentFrameElement';
import { SimVarEditor, SimVarEditorProps } from './SimVars/SimVarEditor';
import { SimVarEditorContext, SimVarEditorContextProps } from './SimVars/SimVarEditorContext';
import { SimVarPopover } from './SimVars/SimVarPopover';
import { ProjectCanvasSaveHandler } from '../Project/fs/Canvas';
import { ProjectInstrumentsHandler } from '../Project/fs/Instruments';
import { CanvasElementFactory } from '../Project/canvas/ElementFactory';
import { PossibleCanvasElements } from '../../shared/types/project/canvas/CanvasSaveFile';

export const Home = () => {
    const { project, loadProject } = useProject();

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

    const history = useHistory();

    const [showNewSimVarPopover, setShowNewSimVarPopover] = useState(false);
    const [newName, setNewName] = useState<string>();
    const [newUnit, setNewUnit] = useState<string>();
    const [newSimVar, setNewSimVar] = useState<string>();
    const [newType, setNewType] = useState<string>();
    const [newMin, setNewMin] = useState<number>();
    const [newMax, setNewMax] = useState<number>();
    const [newStep, setNewStep] = useState<number>();

    const context: SimVarEditorContextProps = {
        name: newName,
        setName: setNewName,
        unit: newUnit,
        setUnit: setNewUnit,
        simVar: newSimVar,
        setSimVar: setNewSimVar,
        type: newType,
        setType: setNewType,
        min: newMin,
        setMin: setNewMin,
        max: newMax,
        setMax: setNewMax,
        step: newStep,
        setStep: setNewStep,
    };

    const [simVarEditors, setSimVarEditors] = useState<SimVarEditorProps[]>([]);

    const onSave = () => {
        setSimVarEditors((editors) => [
            ...editors,
            {
                initialState: context.type === 'number' || context.type === 'range' ? 0 : '',
                name: context.name,
                unit: context.unit,
                simVar: context.simVar,
                type: context.type,
                min: context.min,
                max: context.max,
                step: context.step,
            },
        ]);
        setShowNewSimVarPopover(false);
        setNewName('');
        setNewUnit('');
        setNewSimVar('');
        setNewType('');
        setNewMin(0);
        setNewMax(0);
        setNewStep(0);
    };

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
            <div className="flex flex-col p-5">
                <h1 className="mb-6 text-3xl font-semibold">Webcockpit</h1>
                <h2 className="mb-2">
                    <span className="font-medium">Current Project:</span>
                    {' '}
                    {project?.name}
                </h2>
                <code className="mb-4">{project?.location}</code>
                <div className="space-x-2 mb-4">
                    <button
                        type="button"
                        onClick={async () => {
                            const result = await remote.dialog.showOpenDialog({
                                title: 'Select the root directory of your project',
                                properties: ['openDirectory'],
                            });
                            if (result.filePaths.length !== 1) return;
                            loadProject(result.filePaths[0]);
                        }}
                    >
                        Open Project
                    </button>
                    <button
                        type="button"
                        onClick={() => history.push('/createproject')}
                    >
                        Create Project
                    </button>
                </div>
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
                <h2 className="mb-3 font-medium">SimVars</h2>
                <SimVarEditor name="Altitude" unit="ft" simVar="INDICATED ALTITUDE" initialState={0} type="range" min={0} max={41000} />
                <SimVarEditor name="Airspeed" unit="kn" simVar="AIRSPEED INDICATED" initialState={0} type="range" min={0} max={400} />
                <SimVarEditor name="Heading" unit="deg" simVar="PLANE HEADING DEGREES TRUE" initialState={0} type="range" min={0} max={359} />
                <SimVarEditor name="Pitch" unit="deg" simVar="PLANE PITCH DEGREES" initialState={0} type="range" min={-90} max={90} />
                <SimVarEditor name="Roll" unit="deg" simVar="PLANE BANK DEGREES" initialState={0} type="range" min={-90} max={90} />
                {simVarEditors.map((props) => (
                    <SimVarEditor
                        initialState={props.type}
                        name={props.name}
                        unit={props.unit}
                        simVar={props.simVar}
                        type={props.type}
                        min={props.min}
                        max={props.max}
                        step={props.step}
                    />
                ))}
                <div className="relative">
                    <button
                        type="button"
                        className="w-full mt-3"
                        onClick={() => setShowNewSimVarPopover(true)}
                    >
                        Add SimVars
                    </button>
                    <SimVarEditorContext.Provider value={context}>
                        <SimVarPopover
                            show={showNewSimVarPopover}
                            onCancel={() => setShowNewSimVarPopover(false)}
                            onSave={onSave}
                        />
                    </SimVarEditorContext.Provider>
                </div>
            </div>
            <PanelCanvas>
                {canvasElements.map((canvasElement) => {
                    if (canvasElement.__kind === 'instrument') {
                        return (
                            <InstrumentFrameElement
                                key={canvasElement.title}
                                instrumentFrame={canvasElement}
                                zoom={1}
                                onDelete={() => handleDeleteCanvasElement(canvasElement)}
                            />
                        );
                    }

                    return null;
                })}
            </PanelCanvas>
        </div>
    );
};
