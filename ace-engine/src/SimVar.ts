/**
 * A prefix for a simulation variable
 */
export enum SimVarPrefix {
    A = 'A',
    L = 'L',
}

/**
 * A SimVar
 */
export interface SimVarDefinition {
    prefix: SimVarPrefix,
    name: string,
    unit: string,
}

/**
 * A type for a simulation variable value
 */
export type SimVarValue = number | boolean | string
