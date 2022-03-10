import { createReducer } from '@reduxjs/toolkit';
import { CoherentActivity } from '../../../../shims/Coherent';
import { logCoherentActivity } from '../actions/coherent.actions';

export const coherentReducer = createReducer<{ activity: CoherentActivity[] }>({ activity: [] }, (builder) => {
    builder.addCase(logCoherentActivity, (state, action) => {
        state.activity.push(action.payload);
    });
});
