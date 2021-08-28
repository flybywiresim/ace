import React from 'react';
import { remote } from 'electron';
import { useProject } from '../hooks/ProjectContext';

export const Home = () => {
    const { project, loadProject } = useProject();

    return (
        <div>
            <h1>Webcockpit</h1>
            <h1>{project?.name}</h1>
            <button
                type="button"
                onClick={async () => {
                    await remote.dialog.showOpenDialog({
                        title: 'Select your community directory',
                        properties: ['openDirectory'],
                    });
                }}
            >
                Open Project
            </button>
        </div>
    );
};
