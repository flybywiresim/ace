import { simVarDefinitionFromName, SimVarPrefix, SimVarValue } from '../../../ace-engine/src/SimVar';
import { Coherent } from './Coherent';
import { ViewListener } from './RegisterViewListener';
import { SimulatorInterface } from '../../../ace-engine/src/SimulatorInterface';
import { projectStore } from '../Pages/ProjectHome/Store';
import { setSimVarValue } from '../Pages/ProjectHome/Store/actions/simVarValues.actions';
import { setPersistentValue } from '../Pages/ProjectHome/Store/actions/persistentStorage.actions';

const SIMVAR_NAME_REGEX = /(?:(\w):)?(.+)/;

export class LocalShim implements SimulatorInterface {
    public Coherent = new Coherent();

    public SimVar = {
        GetSimVarValue(key: string): SimVarValue {
            const state = projectStore.getState().simVarValues;
            const { prefix, name } = simVarDefinitionFromName(key, '');

            const value = state[`${prefix}:${name}`];

            if (value === undefined) {
                projectStore.dispatch(setSimVarValue({
                    variable: {
                        name,
                        prefix,
                        unit: 'number',
                    },
                    value: 0,
                }));
            }

            return value ?? 0;
        },
        SetSimVarValue(key: string, unit: string, value: SimVarValue): Promise<SimVarValue> {
            try {
                const [, prefix, name] = SIMVAR_NAME_REGEX[Symbol.match](key);

                if (prefix !== SimVarPrefix.A && prefix !== SimVarPrefix.L) {
                    throw new Error(`[LocalShim](SetSimVarValue) Unknown SimVar prefix: ${prefix}`);
                }

                projectStore.dispatch(setSimVarValue({
                    variable: {
                        name,
                        prefix,
                        unit,
                    },
                    value,
                }));

                return new Promise(((resolve) => resolve(value)));
            } catch (error) {
                console.log(error);

                return new Promise((_, reject) => reject());
            }
        },
        GetGameVarValue(key: string): SimVarValue {
            const state = projectStore.getState().simVarValues;

            return state[key] ?? 0;
        },
    }

    public GetStoredData = (key: string): any => projectStore.getState().persistentStorage[key] ?? ''

    public SetStoredData = (key: string, value: string): any => {
        if (typeof value !== 'string') {
            throw Error('SetStoredData: Illegal type of value! value must be of type string');
        }
        try {
            projectStore.dispatch(setPersistentValue([key, value]));
        } catch (error) {
            console.log(error);
        }
        return null;
    }

    public RegisterViewListener(name: string): ViewListener {
        return new ViewListener(name, this.Coherent);
    }
}
