import { SimVarValue } from './SimVar';

export interface SimulatorInterface {
    Coherent: Coherent

    SimVar: SimVar

    GetStoredData(name: string): string

    SetStoredData(key: string, value: string): void

    RegisterViewListener(type: string, p1: unknown, singleton: boolean): ViewListener
}

interface Coherent {
    trigger(name: string, data: string): any,

    on(name: string, callback: (data: string) => void): { clear: () => void },

    call<T>(name: string, ...args: any[]): Promise<T>
}

export interface ViewListener {
    triggerToAllSubscribers(name: string, data: string): void
}

interface SimVar {
    GetSimVarValue(key: string, unit: string): SimVarValue

    SetSimVarValue(key: string, unit: string, value: SimVarValue): void

    GetGameVarValue(key: string, unit: string): SimVarValue
}
