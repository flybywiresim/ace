import { SimVarDefinition, SimVarValue } from './SimVar';

export interface CoherentEventData {
    readonly name: string,

    readonly callback: (data: string) => void,

    readonly uuid: string,

    readonly instrumentUniqueId: string,

    readonly timestamp: Date,
}

/**
 * Interface for receiving notifications about simulator interface calls
 */
export interface SimCallListener {
    onGetSimVar?(variable: SimVarDefinition, obtainedValue: SimVarValue, instrumentUniqueID: string): void

    onGetGameVar?(variable: SimVarDefinition, obtainedValue: SimVarValue, instrumentUniqueID: string): void

    onSetSimVar?(variable: SimVarDefinition, setValue: SimVarValue, instrumentUniqueID: string): void

    onCoherentCall?(event: string, args: any[], instrumentUniqueID: string): void

    onCoherentNewListener?(data: CoherentEventData, clear: () => void, instrumentUniqueID: string): void,

    onCoherentClearListener?(data: CoherentEventData, instrumentUniqueID: string): void

    onCoherentTrigger?(event: string, args: string[], instrumentUniqueID: string): void

    onRegisterViewListener?(type: string, p1: any, singleton: boolean, instrumentUniqueID: string): void

    onGetStoredData?(key: string, obtainedValue: string, instrumentUniqueID: string): void

    onSetStoredData?(key: string, setValue: string, instrumentUniqueID: string): void
}
