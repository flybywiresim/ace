import React, { FC, useState } from 'react';
import { ProjectDef, ProjectLoadingParams } from '../../../common/project';
import { readProject } from '../queries/project';

export const Home: FC = () => {
    const [recentProjects] = useState<(ProjectDef & ProjectLoadingParams)[]>([
        {
            name: 'a32nx',
            createdAt: Date.now(),
            directory: '../a32nx',
        },
    ]);

    const handleProjectSelected = (def: ProjectDef & ProjectLoadingParams) => {
        const project = readProject(def);

        console.log(project);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100">
            <div className="w-96 flex flex-col items-stretch divide-y divide-gray-400">
                <span className="text-4xl font-semibold mb-5">
                    Recent Projects
                </span>

                <div className="py-5">
                    {recentProjects.length > 0 ? (
                        recentProjects.map((def) => (
                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-xl font-medium">{def.name}</span>
                                    <span>{def.createdAt}</span>
                                </div>
                                <div className="text-5xl text-bold cursor-pointer" onClick={() => handleProjectSelected(def)}>
                                    &rarr;
                                </div>
                            </div>
                        ))
                    ) : (
                        <span className="italic">none</span>
                    )}
                </div>

                <span className="text-xl text-center font-medium pt-5">
                    Create a new project &rarr;
                </span>
            </div>
        </div>
    );
};
