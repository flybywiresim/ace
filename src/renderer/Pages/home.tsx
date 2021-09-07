import React, { useEffect, useRef, useState } from 'react';
import fs from 'fs';
import { remote } from 'electron';
import { useHistory } from 'react-router-dom';
import path from 'path';
import { useProject } from '../hooks/ProjectContext';
import { LocalShim } from '../shims/LocalShim';
import { PanelCanvas, PanelCanvasElement } from './PanelCanvas';

const getInstruments = (instDirStr: string | undefined) => {
    if (instDirStr) {
        const instDir = fs.readdirSync(instDirStr);

        const instrumentsTemp: instrumentType[] = [];

        instDir.forEach((file) => {
            const filePath = path.join(instDirStr, file);
            const fileStats = fs.statSync(filePath);
            if (fileStats.isDirectory()) {
                const individualInstDir = fs.readdirSync(filePath);
                const instrumentFiles: instrumentFileType[] = [];
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

type instrumentFileType = {
    name: string,
    path: string,
    contents: string,
}

type instrumentType = {
    name: string,
    files: instrumentFileType[],
}

export const Home = () => {
    const { project, loadProject } = useProject();
    const [instruments, setInstruments] = useState<instrumentType[]>([]);
    const [selectedInstrument, setSelectedInstrument] = useState<instrumentType>({
        name: '',
        files: [],
    });
    const history = useHistory();
    // useState(() => {
    //     fs.watch(instDirStr, { encoding: 'utf8' }, (eventType, filename) => {
    //         if (filename) {
    //             console.log(filename);
    //         }
    //     });
    // });

    useEffect(() => {
        if (project) {
            const bundlesPath = path.join(project.paths.project, project.paths.bundlesSrc);
            setInstruments(getInstruments(bundlesPath));
        } else {
            setInstruments(getInstruments(undefined));
        }
    }, [project]);

    const iframeRef = useRef<HTMLIFrameElement>();
    const lastUpdate = Date.now();

    useEffect(() => {
        if (iframeRef.current && selectedInstrument.name) {
            const iframeWindow = iframeRef.current.contentWindow;
            const iframeDocument = iframeRef.current.contentDocument;

            iframeDocument.body.style.overflow = 'hidden';

            Object.assign(iframeRef.current.contentWindow, new LocalShim());

            const rootTag = iframeDocument.createElement('div');
            rootTag.id = 'ROOT_ELEMENT';

            const mountTag = iframeDocument.createElement('div');
            mountTag.id = 'MSFS_REACT_MOUNT';

            rootTag.append(mountTag);

            const pfdTag = iframeDocument.createElement('a35-x-ecam');
            pfdTag.setAttribute('url', 'a?Index=1');

            const scriptTag = iframeDocument.createElement('script');
            scriptTag.text = selectedInstrument.files[1].contents;

            const styleTag = iframeDocument.createElement('style');
            styleTag.textContent = selectedInstrument.files[0].contents;

            // Clear all intervals in the iframe
            const lastInterval = iframeWindow.setInterval(() => {
            }, 99999999);
            for (let i = 0; i < lastInterval; i++) {
                iframeWindow.clearInterval(i);
            }

            const lastTimeout = iframeWindow.setTimeout(() => {
            }, 99999999);
            for (let i = 0; i < lastTimeout; i++) {
                iframeWindow.clearTimeout(i);
            }

            iframeDocument.head.innerHTML = '';
            iframeDocument.body.innerHTML = '';
            iframeDocument.body.style.margin = '0';

            iframeDocument.body.append(rootTag);
            iframeDocument.body.append(pfdTag);
            iframeDocument.head.append(styleTag);
            iframeDocument.head.append(scriptTag);

            setInterval(() => {
                iframeDocument.getElementById('ROOT_ELEMENT').dispatchEvent(new CustomEvent('update', { detail: Date.now() - lastUpdate }));
            }, 50);
        }
    }, [iframeRef, selectedInstrument?.name, selectedInstrument.files, setSelectedInstrument]);

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
                    {instruments.map((instrument) => (
                        <button
                            type="button"
                            onClick={() => setSelectedInstrument(instrument)}
                        >
                            {instrument.name}
                        </button>
                    ))}
                </div>
            </div>
            <PanelCanvas render={(zoom) => (
                selectedInstrument.name && (
                    <PanelCanvasElement title={selectedInstrument.name} canvasZoom={zoom}>
                        <iframe
                            title="Instrument Frame"
                            ref={iframeRef}
                            width={768}
                            height={1024}
                        />
                    </PanelCanvasElement>
                )
            )}
            />
        </div>
    );
};
