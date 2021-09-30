import { createAction } from '@reduxjs/toolkit';
import { ProjectData } from '../../../../index';

export const setProjectData = createAction<ProjectData>('SET_PROJECT_DATA');
