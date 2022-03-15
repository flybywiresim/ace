import { v4 } from 'uuid';
import { SimulatorInterface, ViewListener } from './SimulatorInterface';
import { SimCallListener } from './SimCallListener';
import { simVarDefinitionFromName, SimVarValue } from './SimVar';

/**
 * Wraps a {@link SimulatorInterface} instance and dispatches calls to a {@link SimCallListener}
 */
export class ProxyShim implements SimulatorInterface {
    constructor(
        private readonly shim: SimulatorInterface,
        private readonly simCallListener: SimCallListener,
        private readonly instrumentUniqueID: string,
    ) {
    }

    Coherent = {
        trigger: (name: string, ...data: string[]): any => {
            this.simCallListener.onCoherentTrigger?.(name, data, this.instrumentUniqueID);

            return this.shim.Coherent.trigger(name, ...data);
        },

        on: (name: string, callback: (data: string) => void): { clear: () => void } => {
            const data = { name, callback, uuid: v4(), timestamp: new Date() };

            const clear = () => {
                this.simCallListener.onCoherentClearListener?.(data, this.instrumentUniqueID);
                value.clear();
            };

            this.simCallListener.onCoherentNewListener?.(data, clear, this.instrumentUniqueID);
            const value = this.shim.Coherent.on(name, callback);
            return {
                ...value,
                clear,
            };
        },

        call: <T>(name: string, ...args: any[]): Promise<T> => {
            this.simCallListener.onCoherentCall?.(name, args, this.instrumentUniqueID);

            return this.shim.Coherent.call(name, ...args);
        },
    };

    SimVar = {
        GetSimVarValue: (key: string, unit: string): SimVarValue => {
            const value = this.shim.SimVar.GetSimVarValue(key, unit);

            this.simCallListener.onGetSimVar?.(simVarDefinitionFromName(key, unit), value, this.instrumentUniqueID);

            return value;
        },

        SetSimVarValue: (key: string, unit: string, value: SimVarValue): void => {
            this.simCallListener.onSetSimVar?.(simVarDefinitionFromName(key, unit), value, this.instrumentUniqueID);

            return this.shim.SimVar.SetSimVarValue(key, unit, value);
        },

        GetGameVarValue(key: string, unit: string): SimVarValue {
            const value = this.shim.SimVar.GetGameVarValue(key, unit);

            this.simCallListener.onGetGameVar?.(simVarDefinitionFromName(key, unit), value, this.instrumentUniqueID);

            return value;
        },
    };

    RegisterViewListener = (type: string, p1: unknown, singleton: boolean): ViewListener => {
        this.simCallListener.onRegisterViewListener?.(type, p1, singleton, this.instrumentUniqueID);

        return this.shim.RegisterViewListener(type, p1, singleton);
    }

    GetStoredData = (name: string): string => {
        const value = this.shim.GetStoredData(name);

        this.simCallListener.onGetStoredData?.(name, value, this.instrumentUniqueID);

        return value;
    }

    SetStoredData = (key: string, value: string): void => {
        this.simCallListener.onSetStoredData?.(key, value, this.instrumentUniqueID);

        this.shim.SetStoredData(key, value);
    }
}
