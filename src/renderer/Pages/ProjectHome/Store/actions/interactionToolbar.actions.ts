import { createAction } from '@reduxjs/toolkit';
import { WorkspacePanelSelection } from '../reducers/interactionToolbar.reducer';

export const selectWorkspacePanel = createAction<WorkspacePanelSelection>('SET_INTERACTION_PANEL');
