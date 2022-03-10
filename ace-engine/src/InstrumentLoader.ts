import { InstrumentData } from './InstrumentData';
import { SimulatorInterface } from './SimulatorInterface';
import { AceEngineOptions } from './AceEngine';

type AceInstrumentWindow = Window & {
    ACE_UPDATE_TIMER: number | undefined

    ACE_LAST_UPDATE: number | undefined
}

export type InstrumentLoadOptions = AceEngineOptions & {
    onInstrumentError?: (error: Error) => void,
}

export class InstrumentLoader {
    /**
     * Loads an instrument onto an iframe
     *
     * @param instrument instrument data to load
     * @param shim       {@link SimulatorInterface} shim to install onto the instrument container
     * @param onto       iframe to load instrument onto
     * @param options    options for instrument load
     */
    static load(instrument: InstrumentData, shim: SimulatorInterface, onto: HTMLIFrameElement, options: InstrumentLoadOptions): void {
        const iframeWindow = onto.contentWindow as AceInstrumentWindow;
        const iframeDocument = onto.contentDocument;

        // Clear any previous update timers
        if (iframeWindow.ACE_UPDATE_TIMER) {
            iframeWindow.clearInterval(iframeWindow.ACE_UPDATE_TIMER);
        }

        iframeDocument.body.style.overflow = 'hidden';

        InstrumentLoader.installShim(shim, iframeWindow);

        const rootTag = iframeDocument.createElement(instrument.elementName);
        rootTag.id = 'ROOT_ELEMENT';

        const mountTag = iframeDocument.createElement('div');
        mountTag.id = 'MSFS_REACT_MOUNT';

        rootTag.append(mountTag);

        const scriptTag = iframeDocument.createElement('script');
        scriptTag.text = instrument.jsSource;

        const styleTag = iframeDocument.createElement('style');
        styleTag.textContent = instrument.cssSource;

        iframeDocument.head.innerHTML = '<base href="http://localhost:39511/" />';
        iframeDocument.body.innerHTML = '';
        iframeDocument.body.style.margin = '0';

        iframeDocument.body.append(rootTag);
        iframeDocument.head.append(styleTag);
        iframeDocument.head.append(scriptTag);

        (iframeWindow).ACE_UPDATE_TIMER = iframeWindow.setInterval(() => {
            const newUpdate = Date.now();
            const lastUpdate = iframeWindow.ACE_LAST_UPDATE;

            iframeDocument.getElementById('ROOT_ELEMENT').dispatchEvent(new CustomEvent('update', { detail: newUpdate - lastUpdate }));

            iframeWindow.ACE_LAST_UPDATE = newUpdate;
        }, options?.updateInterval ?? 50);

        iframeWindow.addEventListener('error', (e) => {
            options.onInstrumentError(e.error);
        });
    }

    private static installShim(shim: SimulatorInterface, iframeWindow: Window): void {
        for (const key of Object.keys(shim)) {
            (iframeWindow as any)[key] = (shim as any)[key];
        }
    }
}
