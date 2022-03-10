import { createAction } from '@reduxjs/toolkit';
import { CoherentActivity } from '../../../../shims/Coherent';

export const logCoherentActivity = createAction<CoherentActivity>('LOG_COHERENT_ACTIVITY');
