import { createAction } from '@reduxjs/toolkit';
import { SimVarDefinition, SimVarValue } from '../../../../../../ace-engine/src/SimVar';

export interface SetSimVarValuePayload {
    variable: SimVarDefinition,
    value: SimVarValue,
}

export const setSimVarValue = createAction<SetSimVarValuePayload>('SET_SIMVAR_VALUE');
