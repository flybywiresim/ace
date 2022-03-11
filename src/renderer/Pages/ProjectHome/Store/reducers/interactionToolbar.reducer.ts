import { createReducer } from '@reduxjs/toolkit';
import { selectWorkspacePanel } from '../actions/interactionToolbar.actions';

export enum WorkspacePanelSelection {
    None,
    SimVars,
    Timeline,
    Edit,
    LiveReload,
}

export const interactionToolbarReducer = createReducer<{ panel: WorkspacePanelSelection }>({ panel: WorkspacePanelSelection.None }, (builder) => {
    builder.addCase(selectWorkspacePanel, (state, action) => {
        state.panel = action.payload;
    });
});
