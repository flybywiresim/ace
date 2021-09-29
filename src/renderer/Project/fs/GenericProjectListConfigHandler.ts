import { IdentifiableElement } from '../../../shared/types/project/IdentifiableElement';
import { GenericConfigHandler } from './GenericConfigHandler';
import { ProjectData } from '../../index';

export type ListConfig<T extends IdentifiableElement> = { elements: T[] }

export abstract class GenericProjectListConfigHandler<T extends IdentifiableElement> extends GenericConfigHandler<ListConfig<T>> {
    constructor(project: ProjectData) {
        super(project.location);
    }

    createConfig(): ListConfig<T> {
        return {
            elements: [],
        };
    }

    public addObject(object: T): void {
        const currentConfig = this.loadConfig();

        currentConfig.elements.push(object);

        this.saveConfig(currentConfig);
    }

    public updateObject(object: T): boolean {
        const currentConfig = this.loadConfig();

        let didEdit = false;
        currentConfig.elements = currentConfig.elements.filter(({ __uuid }) => {
            const isElement = __uuid !== object.__uuid;

            if (isElement) {
                didEdit = true;
            }

            return isElement;
        });
        currentConfig.elements.push(object);

        this.saveConfig(currentConfig);

        return didEdit;
    }

    public removeObject(object: T): boolean {
        const currentConfig = this.loadConfig();

        let didRemove = false;
        currentConfig.elements = currentConfig.elements.filter(({ __uuid }) => {
            const isElement = __uuid !== object.__uuid;

            if (isElement) {
                didRemove = true;
            }

            return isElement;
        });

        this.saveConfig(currentConfig);

        return didRemove;
    }
}
