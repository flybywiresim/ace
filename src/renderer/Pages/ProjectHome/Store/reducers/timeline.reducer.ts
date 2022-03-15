import { createReducer } from '@reduxjs/toolkit';
import { logActivity } from '../actions/timeline.actions';
import { SimVarDefinition, SimVarValue } from '../../../../../../ace-engine/src/SimVar';
import { CoherentEventData } from '../../../../../../ace-engine/src/SimCallListener';

export enum ActivityType {
    SimVarSet,
    CoherentTrigger,
    CoherentCall,
    CoherentNewOn,
    CoherentClearOn,
    DataStorageSet,
}

export interface BaseActivity {
    kind: ActivityType,
    timestamp: Date,
    instrumentUniqueID: string,
}

export interface SimVarSetActivity extends BaseActivity {
    kind: ActivityType.SimVarSet,
    variable: SimVarDefinition,
    value: SimVarValue,
}

export interface CoherentTriggerCallActivity extends BaseActivity {
    kind: ActivityType.CoherentTrigger | ActivityType.CoherentCall,
    event: string,
    args: any[],
}

export interface CoherentEventActivity extends BaseActivity {
    kind: ActivityType.CoherentNewOn | ActivityType.CoherentClearOn,
    data: CoherentEventData,
}

export interface DataStorageSetActivity extends BaseActivity {
    kind: ActivityType.DataStorageSet,
    key: string,
    value: string,
}

export type Activity = SimVarSetActivity | CoherentTriggerCallActivity | CoherentEventActivity | DataStorageSetActivity

export const timelineReducer = createReducer<{ activity: Activity[] }>({ activity: [] }, (builder) => {
    builder.addCase(logActivity, (state, action) => {
        state.activity.push(action.payload);
    });
});
