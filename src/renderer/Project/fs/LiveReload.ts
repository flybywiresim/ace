import { LiveReloadConfig } from '../../../shared/types/project/LiveReloadConfig';
import { GenericProjectConfigHandler } from './GenericProjectConfigHandler';

export class ProjectLiveReloadHandler extends GenericProjectConfigHandler<LiveReloadConfig> {
    get fileName(): string {
        return 'live-reload.json';
    }
}
