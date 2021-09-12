import React, { FC, useEffect, useRef } from 'react';
import { PanelCanvasElement } from '../PanelCanvas';
import { LocalShim } from '../../shims/LocalShim';

export interface InstrumentFile {
    name: string,
    path: string,
    contents: string,
}

export interface Instrument {
    name: string,
    files: InstrumentFile[],
}

export interface InstrumentFrameProps {
    selectedInstrument: Instrument,
    zoom: number,
}

export const InstrumentFrame: FC<InstrumentFrameProps> = ({ selectedInstrument, zoom }) => {
    const iframeRef = useRef<HTMLIFrameElement>();
    const lastUpdate = useRef(Date.now());

    useEffect(() => {
        if (iframeRef.current && selectedInstrument.name) {
            const iframeWindow = iframeRef.current.contentWindow;
            const iframeDocument = iframeRef.current.contentDocument;

            iframeDocument.body.style.overflow = 'hidden';

            Object.assign(iframeRef.current.contentWindow, new LocalShim());

            const rootTag = iframeDocument.createElement('div');
            rootTag.id = 'ROOT_ELEMENT';

            const mountTag = iframeDocument.createElement('div');
            mountTag.id = 'MSFS_REACT_MOUNT';

            rootTag.append(mountTag);

            const pfdTag = iframeDocument.createElement('a35-x-ecam');
            pfdTag.setAttribute('url', 'a?Index=1');

            const scriptTag = iframeDocument.createElement('script');
            scriptTag.text = selectedInstrument.files[1].contents;

            const styleTag = iframeDocument.createElement('style');
            styleTag.textContent = selectedInstrument.files[0].contents;

            // Clear all intervals in the iframe
            const lastInterval = iframeWindow.setInterval(() => {
            }, 99999999);
            for (let i = 0; i < lastInterval; i++) {
                iframeWindow.clearInterval(i);
            }

            const lastTimeout = iframeWindow.setTimeout(() => {
            }, 99999999);
            for (let i = 0; i < lastTimeout; i++) {
                iframeWindow.clearTimeout(i);
            }

            iframeDocument.head.innerHTML = '';
            iframeDocument.body.innerHTML = '';
            iframeDocument.body.style.margin = '0';

            iframeDocument.body.append(rootTag);
            iframeDocument.body.append(pfdTag);
            iframeDocument.head.append(styleTag);
            iframeDocument.head.append(scriptTag);

            setInterval(() => {
                const newUpdate = Date.now();
                iframeDocument.getElementById('ROOT_ELEMENT').dispatchEvent(new CustomEvent('update', { detail: newUpdate - lastUpdate.current }));
                lastUpdate.current = newUpdate;
            }, 50);
        }
    }, [iframeRef, selectedInstrument?.name, selectedInstrument.files]);

    return (
        <PanelCanvasElement title={selectedInstrument.name} canvasZoom={zoom}>
            <iframe
                title="Instrument Frame"
                ref={iframeRef}
                width={768}
                height={1024}
            />
        </PanelCanvasElement>
    );
};
