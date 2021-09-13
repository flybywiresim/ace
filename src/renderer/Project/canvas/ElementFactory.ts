import { v4 as UUID } from 'uuid';
import { InstrumentFrame } from '../../../shared/types/project/canvas/InstrumentFrame';

export class CanvasElementFactory {
    public static newInstrumentPanel(data: Omit<InstrumentFrame, '__uuid' | '__kind'>): InstrumentFrame {
        return {
            ...data,
            __kind: 'instrument',
            __uuid: UUID(),
        };
    }
}
