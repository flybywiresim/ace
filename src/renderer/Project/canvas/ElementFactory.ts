import { v4 as UUID } from 'uuid';
import { InstrumentFrame } from '../../../shared/types/project/canvas/InstrumentFrame';
import { IdentifiableElementData } from '../../../shared/types/project/IdentifiableElement';
import { SimVarControl } from '../../../shared/types/project/SimVarControl';

export class ElementFactory {
    public static newInstrumentPanel(data: Omit<InstrumentFrame, '__uuid' | '__kind'>): InstrumentFrame {
        return {
            ...data,
            __kind: 'instrument',
            __uuid: UUID(),
        };
    }

    public static newSimVarControl(data: IdentifiableElementData<SimVarControl>): SimVarControl {
        return {
            ...data,
            __uuid: UUID(),
        };
    }
}
