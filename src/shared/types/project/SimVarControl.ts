import { IdentifiableElement } from './IdentifiableElement';
import { SimVarPrefix, SimVarValue } from '../../../../ace-engine/src/SimVar';

export enum SimVarControlStyleTypes {
    TextInput,
    Number,
    Range,
    Checkbox,
    Button,
}

export type SimVarControlStyle =
    | { type: SimVarControlStyleTypes.Number }
    | { type: SimVarControlStyleTypes.Range, min: number, max: number, step: number }
    | { type: SimVarControlStyleTypes.Checkbox }
    | { type: SimVarControlStyleTypes.TextInput }
    | { type: SimVarControlStyleTypes.Button, value: SimVarValue }

/**
 * A SimVar modification control on the sidebar
 */
export interface SimVarControl extends IdentifiableElement {
    /**
     * The display name of the control
     */
    title: string

    /**
     * The prefix of the SimVar
     */
    varPrefix: SimVarPrefix,

    /**
     * The name, WITHOUT prefix, of the SimVar
     */
    varName: string

    /**
     * The unit with which this control sets the SimVar
     */
    varUnit: string,

    /**
     * The visual style of the control
     */
    style: SimVarControlStyle,
}
