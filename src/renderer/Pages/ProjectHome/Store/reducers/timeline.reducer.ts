import { createReducer } from '@reduxjs/toolkit';
import { logActivity } from '../actions/timeline.actions';
import { SimVarDefinition, SimVarValue } from '../../../../../../ace-engine/src/SimVar';
import { CoherentEventData } from './coherent.reducer';

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
    fromInstrument: string,
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

export interface CoherentAddEventActivity extends BaseActivity {
    kind: ActivityType.CoherentNewOn,
    data: CoherentEventData
}

export interface CoherentClearEventActivity extends BaseActivity {
    kind: ActivityType.CoherentClearOn,
    event: string,
    uuid: string,
}

export interface DataStorageSetActivity extends BaseActivity {
    kind: ActivityType.DataStorageSet,
    key: string,
    value: string,
}

export type Activity = SimVarSetActivity | CoherentTriggerCallActivity | CoherentAddEventActivity | CoherentClearEventActivity | DataStorageSetActivity

export const timelineReducer = createReducer<{ activity: Activity[] }>({ activity: [] }, (builder) => {
    builder.addCase(logActivity, (state, action) => {
        state.activity.push(action.payload);
    });
});
