import { PanelDef } from './panel';

export type ProjectCreationParams = {
    directory: string,
    name?: string,
    paths?: {
        panelSrc?: string,
    }
}

export type ProjectLoadingParams = {
    directory: string,
}

export type ProjectDef = {
    name: string,
    createdAt: number,
    paths: {
        panelSrc: string,
    }
}

export type ProjectData = {
    definition: ProjectDef,
    panel: PanelDef,
}
