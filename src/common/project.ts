import { PanelDef } from './panel';

export type ProjectCreationParams = {
    directory: string,
    name?: string,
}

export type ProjectLoadingParams = {
    directory: string,
}

export type ProjectDef = {
    name: string,
    createdAt: number,
}

export type ProjectData = {
    definition: ProjectDef,
    panel: PanelDef,
}
