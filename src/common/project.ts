import { PanelDef } from './panel';

export type ProjectData = {
    name: string,
    panel?: PanelDef,
    paths?: {
        panelSrc?: string,
    }
}
