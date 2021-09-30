import React, { FC } from 'react';
import { useParams } from 'react-router';
import { Provider } from 'react-redux';
import { ProjectData, useProjects } from '../../index';
import { ProjectStoreContext, store } from './Store';

export interface ProjectWorkspaceContainerProps {
    render: (project: ProjectData) => JSX.Element,
}

export const ProjectWorkspaceContainer: FC<ProjectWorkspaceContainerProps> = ({ render }) => {
    const { name } = useParams<{ name: string }>();
    const project = useProjects().projects.find((project) => project.name === name);

    if (project) {
        return (
            <Provider store={store} context={ProjectStoreContext}>
                {render(project)}
            </Provider>
        );
    }

    return null;
};
