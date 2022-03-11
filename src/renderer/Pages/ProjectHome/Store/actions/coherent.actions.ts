import { createAction } from '@reduxjs/toolkit';
import { Activity } from '../reducers/coherent.reducer';

export const logActivity = createAction<Activity>('LOG_ACTIVITY');
