import { SimVarPrefix } from '../SimVar';
import { IdentifiableElement } from './IdentifiableElement';

export enum SimVarControlStyleTypes {
    TEXT_INPUT,
    NUMBER,
    RANGE,
    CHECKBOX,
}

export type SimVarControlStyle =
    | { type: SimVarControlStyleTypes.NUMBER }
    | { type: SimVarControlStyleTypes.RANGE, min: number, max: number, step: number }
    | { type: SimVarControlStyleTypes.CHECKBOX }
    | { type: SimVarControlStyleTypes.TEXT_INPUT }

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
