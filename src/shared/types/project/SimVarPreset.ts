import { IdentifiableElement } from './IdentifiableElement';
import { SimVarDefinition, SimVarValue } from '../SimVar';

export interface SimVarPreset extends IdentifiableElement {

    /**
     * The title of this preset
     */
    title: string,

    /**
     * The SimVar entries for this preset
     */
    entries: SimVarPresetValue[],

}

/**
 * An entry in a SimVarPreset
 */
export interface SimVarPresetValue {
    var: SimVarDefinition,
    value: SimVarValue,
}
