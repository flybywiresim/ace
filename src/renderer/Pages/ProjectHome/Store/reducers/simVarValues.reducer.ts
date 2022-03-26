import { createReducer } from '@reduxjs/toolkit';
import { SimVarValue } from '../../../../../../ace-engine/src/SimVar';
import { setSimVarValue } from '../actions/simVarValues.actions';
import { reset } from '../actions/global.actions';

type SimVarValuesState = Record<string, SimVarValue>

export const simVarValuesReducer = createReducer<SimVarValuesState>({}, (builder) => {
    builder.addCase(reset, (state) => {
        for (const key of Object.getOwnPropertyNames(state)) {
            delete state[key];
        }
    });

    builder.addCase(setSimVarValue, ((state, action) => {
        // TODO units
        const { prefix, name } = action.payload.variable;

        state[`${prefix}:${name}`] = action.payload.value;
    }));
});
