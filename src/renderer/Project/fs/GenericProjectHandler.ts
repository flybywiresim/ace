import { ProjectData } from '../../index';
import { GenericConfigHandler } from './GenericConfigHandler';

export abstract class GenericProjectHandler<T> extends GenericConfigHandler<T> {
    constructor(
        private project: ProjectData,
    ) {
        super(project.location);
    }
}
