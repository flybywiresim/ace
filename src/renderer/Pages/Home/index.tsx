import React, { FC, useContext, useState } from 'react';
import { useHover } from 'use-events';
import { remote } from 'electron';
import { useHistory } from 'react-router-dom';
import { IconFolder, IconFolderPlus, IconArrowRight, IconTrash } from '@tabler/icons';
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

interface RecentProjectsContextInterface {
    recentlyOpenedProjects: RecentlyOpenedProject[];
    setRecentlyOpenedProjects: (projects: RecentlyOpenedProject[]) => void;
}

const RecentProjectsContext = React.createContext<RecentProjectsContextInterface>(undefined as any);

const RecentProjects: FC = () => {
    const [projects, setProjects] = useState(RecentlyOpenedProjects.load());

    return (
        <RecentProjectsContext.Provider value={{
            recentlyOpenedProjects: projects,
            setRecentlyOpenedProjects: setProjects,
        }}
        >
            <div className="w-[27rem] h-full pl-12">
                <h1 className="text-3xl mt-3 mb-4">Recent Projects</h1>

                <div className="w-full flex flex-col gap-y-3">
                    {projects.map(({ name, location }) => (
                        <RecentProjectEntry name={name} location={location} />
                    ))}
                </div>
            </div>
        </RecentProjectsContext.Provider>
    );
};

const RecentProjectEntry: FC<RecentlyOpenedProject> = ({ name, location }) => {
    const { loadProject, closeProject } = useProjects();

    const { recentlyOpenedProjects, setRecentlyOpenedProjects } = useContext(RecentProjectsContext);

    const [hovered, hoverProps] = useHover();

    function handleOpen() {
        loadProject(location);
    }

    function handleProjectClose() {
        setRecentlyOpenedProjects(recentlyOpenedProjects.filter((p) => p.location !== location));
        closeProject(location);
        RecentlyOpenedProjects.remove({ name, location });
    }

    return (
        <div
            className="w-full flex flex-row items-center cursor-pointer transition"
        >
            <div
                {...hoverProps}
                className={`w-full flex flex-col justify-between duration-200 ${hovered && 'text-teal'}`}
                onClick={() => handleOpen()}
            >
                <span className="text-lg">{name}</span>
                <span className="text-lg text-gray-500 font-mono">{location}</span>
            </div>

            <IconTrash
                className="stroke-current text-gray-700 hover:text-red-500 transition duration-200"
                size={42}
                strokeWidth={1.5}
                onClick={() => handleProjectClose()}
            />
            <IconArrowRight
                {...hoverProps}
                className={`ml-4 stroke-current duration-200 ${hovered && 'text-teal'}`}
                size={42}
                strokeWidth={1.5}
                onClick={() => handleOpen()}
            />
        </div>
    );
};
