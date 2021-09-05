import React from 'react';
import { remote } from 'electron';
import { useHistory } from 'react-router-dom';
import { useProject } from '../hooks/ProjectContext';

export const Home = () => {
    const { project, loadProject } = useProject();
    const history = useHistory();

    return (
        <div>
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
        </div>
    );
};
