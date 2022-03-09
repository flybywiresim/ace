import { createReducer } from '@reduxjs/toolkit';
import { SimVarValue } from '../../../../../../ace-engine/src/SimVar';
import { setSimVarValue } from '../actions/simVarValues.actions';

type SimVarValuesState = Record<string, SimVarValue>

export const simVarValuesReducer = createReducer<SimVarValuesState>({}, (builder) => {
    builder.addCase(setSimVarValue, ((state, action) => {
        // TODO units
        const { prefix, name } = action.payload.variable;

        state[`${prefix}:${name}`] = action.payload.value;
    }));
});
