import { SimVarPreset } from '../../../shared/types/project/SimVarPreset';
import { GenericProjectListConfigHandler } from './GenericProjectListConfigHandler';

export class SimVarPresetsHandler extends GenericProjectListConfigHandler<SimVarPreset> {
    get fileName(): string {
        return 'simvar-presets.json';
    }
}
