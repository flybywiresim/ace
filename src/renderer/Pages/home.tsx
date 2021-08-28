import React from 'react';
import { remote } from 'electron';
import { useHistory } from 'react-router-dom';
import { useProject } from '../hooks/ProjectContext';

export const Home = () => {
    const { project, loadProject } = useProject();
    const history = useHistory();

    return (
        <div>
            <h1>Webcockpit</h1>
            <h1>
                Current Project:
                {' '}
                {project?.name}
            </h1>
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
    );
};
