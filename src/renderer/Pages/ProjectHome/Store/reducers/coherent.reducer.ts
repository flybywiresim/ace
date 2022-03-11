import { createReducer } from '@reduxjs/toolkit';
import { logActivity } from '../actions/coherent.actions';
import { SimVarDefinition, SimVarValue } from '../../../../../../ace-engine/src/SimVar';

export enum ActivityType {
    SimVarSet,
    CoherentTrigger,
    CoherentNewOn,
}

export interface BaseActivity {
    kind: ActivityType,
    timestamp: Date,
    fromInstrument: string,
}

export interface SimVarSetActivity extends BaseActivity {
    kind: ActivityType.SimVarSet,
    variable: SimVarDefinition,
    value: SimVarValue,
}

export interface CoherentTriggerActivity extends BaseActivity {
    kind: ActivityType.CoherentTrigger,
    event: string,
    args: any[],
}

export interface CoherentNewOnActivity extends BaseActivity {
    kind: ActivityType.CoherentNewOn,
    event: string,
    callback: Function,
}

export type Activity = SimVarSetActivity | CoherentTriggerActivity | CoherentNewOnActivity

export const coherentReducer = createReducer<{ activity: Activity[] }>({ activity: [] }, (builder) => {
    builder.addCase(logActivity, (state, action) => {
        state.activity.push(action.payload);
    });
});
