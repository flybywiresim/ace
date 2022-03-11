import { SimVarDefinition, SimVarValue } from './SimVar';
import { CoherentEventData } from '../../src/renderer/Pages/ProjectHome/Store/reducers/coherent.reducer';

/**
 * Interface for receiving notifications about simulator interface calls
 */
export interface SimCallListener {
    onGetSimVar?(variable: SimVarDefinition, obtainedValue: SimVarValue): void

    onGetGameVar?(variable: SimVarDefinition, obtainedValue: SimVarValue): void

    onSetSimVar?(variable: SimVarDefinition, setValue: SimVarValue): void

    onCoherentCall?(event: string, ...args: any[]): void

    onCoherentNewListener?(data: CoherentEventData): void,

    onCoherentClearListener?(name: string, callback: (data: string) => void, _uuid: string): void

    onCoherentTrigger?(event: string, ...args: string[]): void

    onRegisterViewListener?(type: string, p1: any, singleton: boolean): void

    onGetStoredData?(key: string, obtainedValue: string): void

    onSetStoredData?(key: string, setValue: string): void
}
