import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
import { useHistory } from 'react-router-dom';
import { useProject } from '../hooks/ProjectContext';
import { LocalShim } from '../shims/LocalShim';
import { PanelCanvas } from './PanelCanvas';
import { Instrument, InstrumentFile, InstrumentFrame } from './Canvas/InstrumentFrame';
import SimVarEditor from './SimVarEditor';
import SimVarEditorContext, { SimVarContextProps } from './SimVarEditorContext';
import SimVarPopover from './SimVarPopover';

const getInstruments = (instDirStr: string | undefined) => {
    if (instDirStr) {
        const instDir = fs.readdirSync(instDirStr);

        const instrumentsTemp: Instrument[] = [];

        instDir.forEach((file) => {
            const filePath = path.join(instDirStr, file);
            const fileStats = fs.statSync(filePath);
            if (fileStats.isDirectory()) {
                const individualInstDir = fs.readdirSync(filePath);
                const instrumentFiles: InstrumentFile[] = [];
                individualInstDir.forEach((instrumentFile) => {
                    const instrumentFilePath = path.join(filePath, instrumentFile);
                    const instrumentFileStats = fs.statSync(instrumentFilePath);
                    if (instrumentFileStats.isFile()) {
                        instrumentFiles.push({
                            name: instrumentFile,
                            path: instrumentFilePath,
                            contents: fs.readFileSync(instrumentFilePath, { encoding: 'utf8' }),
                        });
                    }
                });
                instrumentsTemp.push({
                    name: file,
                    files: instrumentFiles,
                });
            }
        });

        return instrumentsTemp;
    }

    return [];
};

export const Home = () => {
    const { project, loadProject } = useProject();

    const [availableInstruments, setAvailableInstruments] = useState<Instrument[]>([]);
    const [selectedInstruments, setSelectedInstruments] = useState<Instrument[]>([]);

    const history = useHistory();

    const [showNewSimVarPopover, setShowNewSimVarPopover] = useState(false);
    const [newName, setNewName] = useState<string>();
    const [newUnit, setNewUnit] = useState<string>();
    const [newSimVar, setNewSimVar] = useState<string>();
    const [newType, setNewType] = useState<string>();
    const [newMin, setNewMin] = useState<number>();
    const [newMax, setNewMax] = useState<number>();
    const [newStep, setNewStep] = useState<number>();

    const context: SimVarContextProps = {
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

    const [simVarEditors, setSimVarEditors] = useState<JSX.Element[]>([]);

    const onSave = () => {
        setSimVarEditors([
            ...simVarEditors,
            <SimVarEditor
                initialState={context.type === 'number' || context.type === 'range' ? 0 : ''}
                name={context.name}
                unit={context.unit}
                simVar={context.simVar}
                inputType={context.type}
                min={context.min}
                max={context.max}
                step={context.step}
            />,
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
            const bundlesPath = path.join(project.paths.project, project.paths.bundlesSrc);
            setAvailableInstruments(getInstruments(bundlesPath));
        } else {
            setAvailableInstruments(getInstruments(undefined));
        }
    }, [project]);

    return (
        <div className="w-full h-full flex">
            <div className="flex flex-col p-5">
                <h1 className="mb-6 text-3xl font-semibold">Webcockpit</h1>
                <h2 className="mb-2">
                    <span className="font-medium">Current Project:</span>
                    {' '}
                    {project?.name}
                </h2>
                <code className="mb-4">{project?.paths.project}</code>
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
                            onClick={() => setSelectedInstruments((insts) => [...insts, instrument])}
                        >
                            {instrument.name}
                        </button>
                    ))}
                </div>
                <h2 className="mb-3 font-medium">SimVars</h2>
                <SimVarEditor name="Altitude" unit="ft" simVar="INDICATED ALTITUDE" initialState={0} inputType="range" min={0} max={41000} />
                <SimVarEditor name="Airspeed" unit="kn" simVar="AIRSPEED INDICATED" initialState={0} inputType="range" min={0} max={400} />
                <SimVarEditor name="Heading" unit="deg" simVar="PLANE HEADING DEGREES TRUE" initialState={0} inputType="range" min={0} max={359} />
                <SimVarEditor name="Pitch" unit="deg" simVar="PLANE PITCH DEGREES" initialState={0} inputType="range" min={-90} max={90} />
                <SimVarEditor name="Roll" unit="deg" simVar="PLANE BANK DEGREES" initialState={0} inputType="range" min={-90} max={90} />
                {simVarEditors}
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
            <PanelCanvas render={(zoom) => (
                <>
                    {selectedInstruments.map((instrument) => (
                        <InstrumentFrame selectedInstrument={instrument} zoom={zoom} />
                    ))}
                </>
            )}
            />
        </div>
    );
};
