import React, { FC } from 'react';
import { Provider } from 'react-redux';
import { ProjectData } from '../../index';
import { ProjectStoreContext, projectStore } from './Store';
import { ProjectWorkspace } from './ProjectWorkspace';

export interface ProjectWorkspaceContainerProps {
    project: ProjectData,
}

export const ProjectWorkspaceContainer: FC<ProjectWorkspaceContainerProps> = ({ project }) => (
    <Provider store={projectStore} context={ProjectStoreContext}>
        <ProjectWorkspace project={project} />
    </Provider>
);
