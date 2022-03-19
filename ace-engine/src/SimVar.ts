/**
 * A prefix for a simulation variable
 */
export enum SimVarPrefix {
    A = 'A',
    B = 'B',
    C = 'C',
    E = 'E',
    K = 'K',
    L = 'L',
    M = 'M',
    O = 'O',
    R = 'R',
    W = 'W',
    Z = 'Z',
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

export function simVarDefinitionFromName(fullName: string, unit: string): SimVarDefinition {
    const REGEX = /^(?:([ABCEHIKLMORWZ]):)?([\w.: ]+)$/;

    // eslint-disable-next-line prefer-const
    let [, prefix, name] = REGEX[Symbol.match](fullName);

    if (!prefix || !(prefix in SimVarPrefix)) {
        prefix = SimVarPrefix.A;
    }

    const parsedPrefix: SimVarPrefix = prefix as SimVarPrefix;

    return {
        prefix: parsedPrefix,
        name: prefix !== SimVarPrefix.L ? normalizeName(name) : name,
        unit,
    };
}

function normalizeName(name: string): string {
    const indexMatch = /.+:(\d+)/[Symbol.match](name);

    if (indexMatch) {
        const [, index] = indexMatch;
        const numIndex = parseInt(index);

        if (numIndex > 1) {
            return name;
        }

        return name.replace(/:\d+$/, '');
    }

    return name;
}
