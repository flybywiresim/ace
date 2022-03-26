import { InstrumentFrame } from './InstrumentFrame';
import { CockpitPanel } from './CockpitPanel';

export type PossibleCanvasElements = InstrumentFrame | CockpitPanel

export interface CanvasSaveFile {
    elements: PossibleCanvasElements[],
}
