import { CanvasElement } from './CanvasElement';

export interface InstrumentFrame extends CanvasElement<'instrument'> {
    instrumentName: string,
}
