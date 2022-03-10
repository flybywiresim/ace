import { SimVarDefinition, SimVarValue } from '../../../../ace-engine/src/SimVar';
import { GenericConfigHandler } from './GenericConfigHandler';

interface SimVarValueEntry {
    variable: SimVarDefinition,
    value: SimVarValue,
}

interface SimVarValuesData {
    data: SimVarValueEntry[],
}

export class SimVarValuesHandler extends GenericConfigHandler<SimVarValuesData> {
    get fileName(): string {
        return 'data/simvar-values.json';
    }
}
