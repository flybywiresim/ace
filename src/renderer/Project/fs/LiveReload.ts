import { LiveReloadConfig } from '../../../shared/types/project/LiveReloadConfig';
import { GenericProjectHandler } from './GenericProjectHandler';

export class ProjectLiveReloadHandler extends GenericProjectHandler<LiveReloadConfig> {
    get fileName(): string {
        return 'live-reload.json';
    }
}
