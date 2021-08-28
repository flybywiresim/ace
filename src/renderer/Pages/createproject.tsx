import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { remote } from 'electron';
import path from 'path';
import { isInstrumentsFolderSuitable, isProjectFolderSuitable } from '../utils';
import { useProject } from '../hooks/ProjectContext';

export const CreateProject = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [instrumentsLocation, setInstrumentsLocation] = useState('');

    const { createProject } = useProject();
    const history = useHistory();

    return (
        <div>
            <h3>Project Name: </h3>
            <input value={name} onChange={(e) => setName(e.target.value)} />

            <h3>
                Project Location:
                {' '}
                {location}
            </h3>
            <button
                type="button"
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

            <br />
            <br />

            <button
                type="button"
                onClick={async () => {
                    createProject(name, location, instrumentsLocation);
                    history.push('/');
                }}
            >
                Create Project
            </button>
            <button type="button" onClick={() => history.push('/')}>Cancel</button>
        </div>
    );
};
