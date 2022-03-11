import { SimVarDefinition, SimVarValue } from './SimVar';

/**
 * Interface for receiving notifications about simulator interface calls
 */
export interface SimCallListener {
    onGetSimVar?(variable: SimVarDefinition, obtainedValue: SimVarValue): void

    onGetGameVar?(variable: SimVarDefinition, obtainedValue: SimVarValue): void

    onSetSimVar?(variable: SimVarDefinition, setValue: SimVarValue): void

    onCoherentCall?(event: string, ...args: any[]): void

    onCoherentNewListener?(event: string, func: Function): void

    onCoherentTrigger?(event: string, ...args: string[]): void

    onRegisterViewListener?(type: string, p1: any, singleton: boolean): void

    onGetStoredData?(key: string, obtainedValue: string): void

    onSetStoredData?(key: string, setValue: string): void
}
