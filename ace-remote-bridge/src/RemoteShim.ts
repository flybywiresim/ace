import { SimulatorInterface, ViewListener } from 'ace-engine/src/SimulatorInterface';
import { simVarDefinitionFromName, SimVarValue } from 'ace-engine/src/SimVar';
import { RemoteBridgeAceClient } from './RemoteBridgeAceClient';
import { RemoteBridgeRequestCommand } from './RemoteBridgeRequest';

export interface RemoteShimOptions {
    ignoredCoherentTriggers?: string[],
}

export class RemoteShim implements SimulatorInterface {
    constructor(
        readonly client: RemoteBridgeAceClient,
        readonly options?: RemoteShimOptions,
    ) {
    }

    private cache: Record<string, SimVarValue> = {};

    SimVar = {
        GetSimVarValue: (key: string, unit: string): SimVarValue => {
            const def = simVarDefinitionFromName(key, unit);

            const cached = this.client.simVarState[`${def.prefix}:${def.name}, ${unit}`];

            if (cached === undefined) {
                const id = Math.round(Math.random() * 1_000_000);
                this.client.sendMessage([RemoteBridgeRequestCommand.SIMVAR_SUBSCRIBE, `${def.prefix}:${def.name}`, unit, id]);

                this.client.simVarSubscriptions[id] = `${def.prefix}:${def.name}, ${unit}`;

                return 0;
            }

            return cached;
        },

        SetSimVarValue: (key: string, unit: string, value: SimVarValue): Promise<void> => {
            const id = Math.round(Math.random() * 1_000_000);

            this.client.sendMessage([RemoteBridgeRequestCommand.SIMVAR_SET, id, key, unit, JSON.stringify(value)]);

            return new Promise((resolve, reject) => {
                this.client.simVarSetCallbacks[id] = (failed: boolean) => {
                    if (failed) {
                        reject();
                    } else {
                        resolve();
                    }
                };
            });
        },

        GetGameVarValue(key: string, unit: string): SimVarValue {
            return 0;
        },
    }

    Coherent = {
        trigger: (name: string, ...data: string[]): any => {
            if (this.options?.ignoredCoherentTriggers && this.options.ignoredCoherentTriggers.includes(name)) {
                return;
            }

            console.log(`trigger: ${name}`);
            // noop
        },

        on: (name: string, callback: (...data: string[]) => void): { clear: () => void } => {
            this.client.sendMessage([RemoteBridgeRequestCommand.COHERENT_SUBSCRIBE, name]);

            this.client.coherentEventSubscriptions.push([name, callback]);

            return {
                clear: () => {
                    console.log('cleared');
                },
            };
        },

        call<T>(name: string, ...args: any[]): Promise<T> {
            throw new Error('Not yet implemented: call');
        },
    };

    GetStoredData = (name: string): string => localStorage[name] ?? ''

    RegisterViewListener = (type: string, p1: unknown, singleton: boolean): ViewListener => ({
        triggerToAllSubscribers(name: string, data: string) {
            // noop
        },
    })

    SetStoredData = (key: string, value: string): void => {
        localStorage[key] = value;
    }
}
