import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { remote } from 'electron';
import path from 'path';
import { isHtmlUiFolderSuitable, isInstrumentsFolderSuitable, isProjectFolderSuitable } from '../../utils/project';
import { useProjects } from '../index';

export const CreateProject = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [instrumentsLocation, setInstrumentsLocation] = useState('');
    const [htmlUiLocation, setHtmlUiLocation] = useState('');
    const [bundlesLocation, setBundlesLocation] = useState('');

    const { createProject } = useProjects();
    const history = useHistory();

    return (
        <div>
            <h3>Project Name: </h3>
            <input
                value={name}
                className="mb-2 pl-1 rounded-md text-white"
                onChange={(e) => setName(e.target.value)}
            />

            <h3>
                Project Location:
                {' '}
                {location}
            </h3>
            <button
                type="button"
                className="mb-2"
                onClick={async () => {
                    const result = await remote.dialog.showOpenDialog({
                        title: 'Select the root directory of your project',
                        properties: ['openDirectory'],
                    });
                    if (result.filePaths.length !== 1) window.alert('Too many Folders Selected');
                    if (!isProjectFolderSuitable(result.filePaths[0])) return;
                    setLocation(result.filePaths[0]);
                }}
            >
                Select Folder
            </button>
            <h3>
                Instruments Location:
                {' '}
                {instrumentsLocation}
            </h3>
            <button
                type="button"
                className="mb-2"
                onClick={async () => {
                    const result = await remote.dialog.showOpenDialog({
                        title: 'Select the Instruments folder of your project',
                        properties: ['openDirectory'],
                        defaultPath: path.join(location, 'src/instruments/src'),
                    });
                    if (result.filePaths.length !== 1) window.alert('Too many Folders Selected');
                    if (!isInstrumentsFolderSuitable(result.filePaths[0], location)) return;
                    setInstrumentsLocation(result.filePaths[0]);
                }}
            >
                Select Instruments Folder
            </button>
            <h3>
                Bundles Location:
                {' '}
                {bundlesLocation}
            </h3>
            <button
                type="button"
                className="mb-2"
                onClick={async () => {
                    const result = await remote.dialog.showOpenDialog({
                        title: 'Select the Bundles folder of your project',
                        properties: ['openDirectory'],
                        defaultPath: path.join(location, '.'),
                    });
                    if (result.filePaths.length !== 1) window.alert('Too many Folders Selected');
                    if (!isInstrumentsFolderSuitable(result.filePaths[0], location)) return;
                    setBundlesLocation(result.filePaths[0]);
                }}
            >
                Select Bundles Folder
            </button>

            <h3>
                html_ui Location:
                {' '}
                {htmlUiLocation}
            </h3>
            <button
                type="button"
                className="mb-2"
                onClick={async () => {
                    const result = await remote.dialog.showOpenDialog({
                        title: 'Select the Bundles folder of your project',
                        properties: ['openDirectory'],
                        defaultPath: path.join(location, '.'),
                    });
                    if (result.filePaths.length !== 1) window.alert('Too many Folders Selected');
                    if (!isHtmlUiFolderSuitable(result.filePaths[0], location)) return;
                    setHtmlUiLocation(result.filePaths[0]);
                }}
            >
                Select html_ui Folder
            </button>

            <br />
            <br />

            <div className="space-x-2">
                <button
                    type="button"
                    onClick={async () => {
                        createProject(name.replace(/\s/g, '-'), location, instrumentsLocation, bundlesLocation, htmlUiLocation);
                        history.push('/');
                    }}
                >
                    Create Project
                </button>
                <button type="button" onClick={() => history.push('/')}>Cancel</button>
            </div>
        </div>
    );
};
