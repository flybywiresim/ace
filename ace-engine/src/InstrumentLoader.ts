import { BundledInstrumentData, WebInstrumentData } from './InstrumentData';
import { SimulatorInterface } from './SimulatorInterface';
import { AceEngine, AceEngineOptions } from './AceEngine';
import { ProxyShim } from './ProxyShim';

type AceInstrumentWindow = Window & {
    ACE_ENGINE_HANDLE: AceEngine

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
     * @param engine     instance of {@link AceEngine}
     * @param options    options for instrument load
     */
    static loadFromBundles(instrument: BundledInstrumentData, shim: SimulatorInterface, onto: HTMLIFrameElement, engine: AceEngine, options: InstrumentLoadOptions): void {
        const iframeWindow = onto.contentWindow as AceInstrumentWindow;
        const iframeDocument = onto.contentDocument;

        iframeDocument.body.style.overflow = 'hidden';

        const wrappedShim = options.simCallListener ? new ProxyShim(shim, options.simCallListener, instrument.uniqueID) : shim;
        InstrumentLoader.installShim(wrappedShim, iframeWindow);

        const rootTag = iframeDocument.createElement(instrument.elementName);
        rootTag.id = 'ROOT_ELEMENT';

        const mountTag = iframeDocument.createElement('div');
        mountTag.id = 'MSFS_REACT_MOUNT';

        rootTag.append(mountTag);

        const scriptTag = iframeDocument.createElement('script');
        scriptTag.setAttribute('data-ace-filename', instrument.jsSource.fileName);
        scriptTag.text = instrument.jsSource.contents;

        const styleTag = iframeDocument.createElement('style');
        styleTag.setAttribute('data-ace-filename', instrument.cssSource.fileName);
        styleTag.textContent = instrument.cssSource.contents;

        iframeDocument.head.innerHTML = '<base href="http://localhost:39511/" />';
        iframeDocument.body.innerHTML = '';
        iframeDocument.body.style.margin = '0';

        iframeDocument.body.append(rootTag);
        iframeDocument.head.append(styleTag);
        iframeDocument.head.append(scriptTag);

        InstrumentLoader.prepareIframeWindow(iframeWindow, iframeDocument, engine, options);
    }

    static loadFromUrl({ url }: WebInstrumentData, shim: SimulatorInterface, onto: HTMLIFrameElement, engine: AceEngine, options: InstrumentLoadOptions): void {
        const iframeWindow = onto.contentWindow as AceInstrumentWindow;

        iframeWindow.location.assign(url);

        onto.addEventListener('load', () => {
            const iframeDocument = onto.contentDocument;

            iframeDocument.body.style.overflow = 'hidden';

            const baseTag = iframeDocument.createElement('base');
            baseTag.setAttribute('url', 'http://localhost:39511/');

            iframeDocument.head.appendChild(baseTag);

            const wrappedShim = options.simCallListener ? new ProxyShim(shim, options.simCallListener, `Web-${Math.round(Math.random() * 10_000)}`) : shim;
            InstrumentLoader.installShim(wrappedShim, iframeWindow);

            InstrumentLoader.prepareIframeWindow(iframeWindow, iframeDocument, engine, options);

            iframeWindow.dispatchEvent(new CustomEvent('AceInitialized'));
        });
    }

    private static prepareIframeWindow(iframeWindow: AceInstrumentWindow, iframeDocument: Document, engine: AceEngine, options: InstrumentLoadOptions): void {
        iframeWindow.ACE_ENGINE_HANDLE = engine;

        // Clear any previous update timers
        if (iframeWindow.ACE_UPDATE_TIMER) {
            iframeWindow.clearInterval(iframeWindow.ACE_UPDATE_TIMER);
        }

        iframeWindow.ACE_UPDATE_TIMER = iframeWindow.setInterval(() => {
            const newUpdate = Date.now();
            const lastUpdate = iframeWindow.ACE_LAST_UPDATE;

            iframeDocument.getElementById('ROOT_ELEMENT').dispatchEvent(new CustomEvent('update', { detail: newUpdate - lastUpdate }));

            iframeWindow.ACE_LAST_UPDATE = newUpdate;
        }, options?.updateInterval ?? 50);

        iframeWindow.addEventListener('error', (e) => {
            options.onInstrumentError(e.error);
        });
    }

    static installShim(shim: SimulatorInterface, object: any): void {
        for (const key of Object.keys(shim)) {
            object[key] = (shim as any)[key];
        }
    }
}
