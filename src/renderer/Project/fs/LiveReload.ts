import { LiveReloadConfig } from '../../../shared/types/project/LiveReloadConfig';
import { GenericConfigHandler } from './GenericConfigHandler';

export class ProjectLiveReloadHandler extends GenericConfigHandler<LiveReloadConfig> {
    get fileName(): string {
        return 'live-reload.json';
    }
}
