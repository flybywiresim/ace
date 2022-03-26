import { CanvasElement } from './CanvasElement';

export interface BaseInstrumentFrame extends CanvasElement<'instrument'> {
    dataKind: string,
}

export interface NamedInstrumentFrame extends BaseInstrumentFrame {
    dataKind: 'bundled',
    instrumentName: string,
}

export interface WebInstrumentFrame extends BaseInstrumentFrame {
    dataKind: 'web',
    url: string
}

export type InstrumentFrame = NamedInstrumentFrame | WebInstrumentFrame
