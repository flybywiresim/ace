import { createReducer } from '@reduxjs/toolkit';
import { addCoherentEvent, clearCoherentEvent } from '../actions/coherent.actions';
import { CoherentEventData } from '../../../../../../ace-engine/src/SimCallListener';

export const coherentReducer = createReducer<{ events: { data: CoherentEventData, clear:() => void }[] }>({ events: [] }, (builder) => {
    builder.addCase(addCoherentEvent, (state, action) => {
        state.events.push(action.payload);
    });

    builder.addCase(clearCoherentEvent, (state, action) => {
        state.events.splice(state.events.findIndex((event) => event.data.uuid === action.payload), 1);
    });
});
