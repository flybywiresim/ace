/**
 * Instance of an ACE runtime
 */
import { SimulatorInterface } from './SimulatorInterface';
import { InstrumentData } from './InstrumentData';
import { InstrumentLoader, InstrumentLoadOptions } from './InstrumentLoader';
import { SimCallListener } from './SimCallListener';
import { ProxyShim } from './ProxyShim';

export interface AceEngineOptions {
    /**
     * Update interval, in milliseconds, of loaded instruments
     */
    updateInterval?: number

    /**
     * Instance of {@link SimCallListener}
     */
    simCallListener?: SimCallListener,
}

export class AceEngine {
    private readonly shim: SimulatorInterface

    constructor(
        shim: SimulatorInterface,
        readonly options?: AceEngineOptions,
    ) {
        this.shim = options.simCallListener ? new ProxyShim(shim, options.simCallListener) : shim;
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
