import { CanvasElement } from './CanvasElement';

export interface CockpitPanel extends CanvasElement<'cockpit-panel'> {
    text: string,
}
