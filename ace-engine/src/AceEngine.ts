/**
 * Instance of an ACE runtime
 */
import { SimulatorInterface } from './SimulatorInterface';
import { InstrumentData } from './InstrumentData';
import { InstrumentLoader, InstrumentLoadOptions } from './InstrumentLoader';

export interface AceEngineOptions {
    /**
     * Update interval, in milliseconds, of loaded instruments
     */
    updateInterval?: number
}

export class AceEngine {
    constructor(
        readonly shim: SimulatorInterface,
        readonly options?: AceEngineOptions,
    ) {
    }

    /**
     * Loads an instrument onto an iframe
     *
     * @param instrument      instrument data to load
     * @param onto            iframe to load instrument onto
     * @param overrideOptions overridden options for instrument load
     */
    loadInstrument(instrument: InstrumentData, onto: HTMLIFrameElement, overrideOptions?: InstrumentLoadOptions): void {
        InstrumentLoader.load(instrument, this.shim, onto, { ...this.options, ...overrideOptions });
    }
}
