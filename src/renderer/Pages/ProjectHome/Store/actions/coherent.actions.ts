import { createAction } from '@reduxjs/toolkit';
import { CoherentEventData } from '../../../../../../ace-engine/src/SimCallListener';

export const addCoherentEvent = createAction<{ data: CoherentEventData, clear:() => void }>('ADD_COHERENT_EVENT');

export const clearCoherentEvent = createAction<string>('CLEAR_COHERENT_EVENT');
