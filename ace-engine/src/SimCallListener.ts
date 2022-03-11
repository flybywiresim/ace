import { SimVarDefinition, SimVarValue } from './SimVar';

export interface CoherentEventData {
    readonly name: string,

    readonly callback: (data: string) => void,

    readonly uuid: string,

    readonly timestamp: Date,
}

/**
 * Interface for receiving notifications about simulator interface calls
 */
export interface SimCallListener {
    onGetSimVar?(variable: SimVarDefinition, obtainedValue: SimVarValue): void

    onGetGameVar?(variable: SimVarDefinition, obtainedValue: SimVarValue): void

    onSetSimVar?(variable: SimVarDefinition, setValue: SimVarValue): void

    onCoherentCall?(event: string, ...args: any[]): void

    onCoherentNewListener?(data: CoherentEventData, clear: () => void): void,

    onCoherentClearListener?(data: CoherentEventData): void

    onCoherentTrigger?(event: string, ...args: string[]): void

    onRegisterViewListener?(type: string, p1: any, singleton: boolean): void

    onGetStoredData?(key: string, obtainedValue: string): void

    onSetStoredData?(key: string, setValue: string): void
}
