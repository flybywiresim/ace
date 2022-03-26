import { createAction } from '@reduxjs/toolkit';
import { Activity } from '../reducers/timeline.reducer';

export const logActivity = createAction<Activity>('LOG_ACTIVITY');
