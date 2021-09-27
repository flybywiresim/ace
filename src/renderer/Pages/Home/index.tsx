import React, { FC } from 'react';
import { remote } from 'electron';
import { useHistory } from 'react-router-dom';
import { IconArrowRight, IconFolder, IconFolderPlus, IconSettings } from '@tabler/icons';
import { useProjects } from '../../index';
import { RecentlyOpenedProject, RecentlyOpenedProjects } from '../../Project/recently-opened';

export const Home: FC = () => {
    const history = useHistory();
    const { loadProject } = useProjects();

    const handleOpenProject = async () => {
        const result = await remote.dialog.showOpenDialog({
            title: 'Select the root directory of your project',
            properties: ['openDirectory'],
        });

        if (result.filePaths.length !== 1) {
            return;
        }

        loadProject(result.filePaths[0]);
    };

    return (
        <div className="relative h-full flex flex-col justify-center">
            <IconSettings
                size={32}
                className="absolute cursor-pointer top-4 right-4 stroke-current text-gray-500 hover:text-white transition duration-300"
                onClick={() => history.push('/ace-config')}
            />
            <div className="h-72 flex flex-row justify-center items-center divide-x divide-gray-600 space-x-12">
                <div className="w-72 h-full flex flex-col gap-y-2">
                    <h1 className="text-5xl font-medium mb-1.5">Welcome.</h1>
                    <p className="text-2xl">Where do you want to start today?</p>

                    <button className="w-full h-12 px-4 mt-auto bg-gray-700 text-xl flex flex-row gap-x-4 items-center" type="button" onClick={handleOpenProject}>
                        Open Project
                        <IconFolder size={28} className="ml-auto" />
                    </button>
                    <button className="w-full h-12 px-4 bg-teal-medium text-xl flex flex-row gap-x-4 items-center" type="button" onClick={() => history.push('/create-project')}>
                        Create Project
                        <IconFolderPlus size={28} className="ml-auto" />
                    </button>
                </div>

                <RecentProjects />
            </div>
        </div>
    );
};

const RecentProjects: FC = () => {
    const projects = RecentlyOpenedProjects.load();

    return (
        <div className="w-96 h-full pl-12">
            <h1 className="text-3xl mt-3 mb-4">Recent Projects</h1>

            <div className="w-full flex flex-col gap-y-3">
                {projects.map(({ name, location }) => (
                    <RecentProjectEntry name={name} location={location} key={name} />
                ))}
            </div>
        </div>
    );
};

const RecentProjectEntry: FC<RecentlyOpenedProject> = ({ name, location }) => {
    const { loadProject } = useProjects();

    const handleOpen = (location: string) => loadProject(location);

    return (
        <div
            className="w-full flex flex-row items-center cursor-pointer hover:text-teal"
            onClick={() => handleOpen(location)}
        >
            <div className="w-full flex flex-col justify-between">
                <span className="text-lg">{name}</span>
                <span className="text-lg text-gray-500 font-mono">{location}</span>
            </div>

            <IconArrowRight className="" size={42} strokeWidth={1.5} />
        </div>
    );
};
