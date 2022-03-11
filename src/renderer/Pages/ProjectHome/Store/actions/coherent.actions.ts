import { createAction } from '@reduxjs/toolkit';
import { CoherentEventData } from '../reducers/coherent.reducer';

export const addCoherentEvent = createAction<CoherentEventData>('ADD_COHERENT_EVENT');

export const clearCoherentEvent = createAction<string>('CLEAR_COHERENT_EVENT');
