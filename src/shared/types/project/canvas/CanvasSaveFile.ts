import { InstrumentFrame } from './InstrumentFrame';

export type PossibleCanvasElements = InstrumentFrame;

export interface CanvasSaveFile {
    elements: PossibleCanvasElements[],
}
