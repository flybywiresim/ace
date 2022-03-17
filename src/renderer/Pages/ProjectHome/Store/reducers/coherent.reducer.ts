import { createReducer } from '@reduxjs/toolkit';
import { addCoherentEvent, clearCoherentEvent, clearCoherentEventsForUniqueID } from '../actions/coherent.actions';
import { CoherentEventData } from '../../../../../../ace-engine/src/SimCallListener';
import { reset } from '../actions/global.actions';

export const coherentReducer = createReducer<{ events: { data: CoherentEventData, clear:() => void }[] }>({ events: [] }, (builder) => {
    builder.addCase(reset, (state) => {
        state.events.length = 0;
    });

    builder.addCase(addCoherentEvent, (state, action) => {
        state.events.push(action.payload);
    });

    builder.addCase(clearCoherentEvent, (state, action) => {
        state.events.splice(state.events.findIndex((event) => event.data.uuid === action.payload), 1);
    });

    builder.addCase(clearCoherentEventsForUniqueID, (state, action) => {
        state.events = state.events.filter((it) => it.data.instrumentUniqueId !== action.payload);
    });
});
