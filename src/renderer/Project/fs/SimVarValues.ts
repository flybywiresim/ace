import { SimVarDefinition, SimVarValue } from '../../../../ace-engine/src/SimVar';
import { GenericProjectConfigHandler } from './GenericProjectConfigHandler';

interface SimVarValueEntry {
    variable: SimVarDefinition,
    value: SimVarValue,
}

interface SimVarValuesData {
    elements: SimVarValueEntry[],
}

export class SimVarValuesHandler extends GenericProjectConfigHandler<SimVarValuesData> {
    get fileName(): string {
        return 'data/simvar-values.json';
    }
}
