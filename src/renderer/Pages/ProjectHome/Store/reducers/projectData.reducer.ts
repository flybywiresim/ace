import { createReducer } from '@reduxjs/toolkit';
import { setProjectData } from '../actions/projectData.actions';
import { ProjectData } from '../../../../index';

export const projectDataReducer = createReducer<{ data: ProjectData | null }>({ data: null }, (builder) => {
    builder.addCase(setProjectData, (state, action) => {
        state.data = action.payload;
    });
});
