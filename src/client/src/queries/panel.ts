import { PanelDef } from '../../../common/panel';

export async function getPanel(): Promise<PanelDef> {
    const request = await fetch('/api/panel');

    return request.json();
}
