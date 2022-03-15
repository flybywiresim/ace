/**
 * Instance of an ACE runtime
 */
import { SimulatorInterface } from './SimulatorInterface';
import { BundledInstrumentData, WebInstrumentData } from './InstrumentData';
import { InstrumentLoader, InstrumentLoadOptions } from './InstrumentLoader';
import { SimCallListener } from './SimCallListener';

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
    constructor(
        private readonly shim: SimulatorInterface,
        private readonly options?: AceEngineOptions,
    ) {
    }

    /**
     * Loads an instrument onto an iframe
     *
     * @param instrument      instrument data to load
     * @param onto            iframe to load instrument onto
     * @param overrideOptions overridden options for instrument load
     */
    loadBundledInstrument(instrument: BundledInstrumentData, onto: HTMLIFrameElement, overrideOptions?: InstrumentLoadOptions): void {
        InstrumentLoader.loadFromBundles(instrument, this.shim, onto, this, { ...this.options, ...overrideOptions });
    }

    /**
     * Loads an instrument onto an iframe
     *
     * @param instrument      instrument data to load
     * @param onto            iframe to load instrument onto
     * @param overrideOptions overridden options for instrument load
     */
    loadWebInstrument(instrument: WebInstrumentData, onto: HTMLIFrameElement, overrideOptions?: InstrumentLoadOptions): void {
        InstrumentLoader.loadFromUrl(instrument, this.shim, onto, this, { ...this.options, ...overrideOptions });
    }

    /**
     * Installs the engine's shim object onto a given object
     *
     * @param object the object (usually window) to install the shim onto
     */
    installShim(object: any) {
        InstrumentLoader.installShim(this.shim, object);
    }
}
