// eslint-disable-next-line import/no-extraneous-dependencies
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
    ) {
    }

    Coherent = {
        trigger: (name: string, data: string): any => {
            this.simCallListener.onCoherentTrigger?.(name, data);

            return this.shim.Coherent.trigger(name, data);
        },

        on: (name: string, callback: (data: string) => void): { clear: () => void } => {
            const _uuid = v4();
            const clear = () => {
                this.simCallListener.onCoherentClearListener?.(name, callback, _uuid);
                value.clear();
            };

            this.simCallListener.onCoherentNewListener?.({ name, callback, creationTimestamp: new Date(), _uuid, clear });
            const value = this.shim.Coherent.on(name, callback);
            return {
                ...value,
                clear,
            };
        },

        call: <T>(name: string, ...args: any[]): Promise<T> => {
            this.simCallListener.onCoherentCall?.(name, ...args);

            return this.shim.Coherent.call(name, ...args);
        },
    };

    SimVar = {
        GetSimVarValue: (key: string, unit: string): SimVarValue => {
            const value = this.shim.SimVar.GetSimVarValue(key, unit);

            this.simCallListener.onGetSimVar?.(simVarDefinitionFromName(key, unit), value);

            return value;
        },

        SetSimVarValue: (key: string, unit: string, value: SimVarValue): void => {
            this.simCallListener.onSetSimVar?.(simVarDefinitionFromName(key, unit), value);

            return this.shim.SimVar.SetSimVarValue(key, unit, value);
        },

        GetGameVarValue(key: string, unit: string): SimVarValue {
            const value = this.shim.SimVar.GetGameVarValue(key, unit);

            this.simCallListener.onGetGameVar?.(simVarDefinitionFromName(key, unit), value);

            return value;
        },
    };

    RegisterViewListener = (type: string, p1: unknown, singleton: boolean): ViewListener => {
        this.simCallListener.onRegisterViewListener?.(type, p1, singleton);

        return this.shim.RegisterViewListener(type, p1, singleton);
    }

    GetStoredData = (name: string): string => {
        const value = this.shim.GetStoredData(name);

        this.simCallListener.onGetStoredData?.(name, value);

        return value;
    }

    SetStoredData = (key: string, value: string): void => {
        this.simCallListener.onSetStoredData?.(key, value);

        this.shim.SetStoredData(key, value);
    }
}
