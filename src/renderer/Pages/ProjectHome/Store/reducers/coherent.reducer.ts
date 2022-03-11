import { createReducer } from '@reduxjs/toolkit';
import { addCoherentEvent, clearCoherentEvent } from '../actions/coherent.actions';

export interface CoherentEventData {
    readonly name: string,

    readonly callback: (data: string) => void,

    readonly _uuid: string,

    readonly creationTimestamp: Date,

    readonly clear: () => void,
}

export const coherentReducer = createReducer<{ events: CoherentEventData[] }>({ events: [] }, (builder) => {
    builder.addCase(addCoherentEvent, (state, action) => {
        state.events.push(action.payload);
    });

    builder.addCase(clearCoherentEvent, (state, action) => {
        state.events.splice(state.events.findIndex((event) => event._uuid === action.payload), 1);
    });
});
