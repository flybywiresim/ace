import React, { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
import { useHistory } from 'react-router-dom';
import { useProject } from '../hooks/ProjectContext';
import { PanelCanvas } from './PanelCanvas';
import { Instrument, InstrumentFile, InstrumentFrame } from './Canvas/InstrumentFrame';

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
                <h1 className="mb-2 text-3xl">Webcockpit</h1>
                <h2 className="mb-2 mt-4">
                    Current Project:
                    {' '}
                    {project?.name}
                    <br />
                    {project?.paths.project}
                </h2>
                <div className="space-x-2">
                    <button
                        type="button"
                        className=""
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
