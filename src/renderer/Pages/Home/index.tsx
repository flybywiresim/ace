import React, { FC } from 'react';
import { remote } from 'electron';
import { useHistory } from 'react-router-dom';
import { useProject } from '../../hooks/ProjectContext';

export const Home: FC = () => {
    const history = useHistory();
    const { loadProject } = useProject();

    const handleOpenProject = async () => {
        const result = await remote.dialog.showOpenDialog({
            title: 'Select the root directory of your project',
            properties: ['openDirectory'],
        });

        if (result.filePaths.length !== 1) {
            return;
        }

        loadProject(result.filePaths[0]);

        history.push('/project');
    };

    return (
        <div className="h-full flex flex-col justify-center items-center space-y-2">
            <button className="w-40 h-12" type="button" onClick={handleOpenProject}>
                Open Project
            </button>
            <button className="w-40 h-12" type="button" onClick={() => history.push('/create-project')}>
                Create Project
            </button>
        </div>
    );
};
