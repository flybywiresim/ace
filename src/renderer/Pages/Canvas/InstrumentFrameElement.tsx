import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import path from 'path';
import { PanelCanvasElement } from '../PanelCanvas';
import { LocalShim } from '../../shims/LocalShim';
import { ProjectInstrumentsHandler } from '../../Project/fs/Instruments';
import { InstrumentFrame } from '../../../shared/types/project/canvas/InstrumentFrame';
import { useWorkspace } from '../ProjectHome/WorkspaceContext';

export interface InstrumentFile {
    name: string,
    path: string,
    contents: string,
}

export interface Instrument {
    files: InstrumentFile[],
    config: InstrumentConfig,
}

export interface InstrumentConfig {
    index: string,
    isInteractive: boolean,
    name: string,
    dimensions: InstrumentDimensions,
}

export interface InstrumentDimensions {
    width: number,
    height: number,
}

export interface InstrumentFrameElementProps {
    instrumentFrame: InstrumentFrame,
    zoom: number,
    onDelete: () => void,
    onUpdate: (el: InstrumentFrame) => void
}

export const InstrumentFrameElement: FC<InstrumentFrameElementProps> = ({ instrumentFrame, zoom, onDelete, onUpdate }) => {
    const { project, liveReloadDispatcher, inInteractionMode, setInInteractionMode } = useWorkspace();

    useEffect(() => {
        console.log(`[InstrumentFrameElement(${instrumentFrame.title})] Hooking into a new LiveReloadDispatcher.`);

        const sub = liveReloadDispatcher.subscribe(instrumentFrame.instrumentName, (fileName, contents) => {
            console.log(`[InstrumentFrameElement(${instrumentFrame.title})] File updated: ${fileName}.`);

            loadedInstrument.files.find((file) => file.name === path.basename(fileName)).contents = contents;

            doLoadInstrument();
        });

        return () => liveReloadDispatcher.unsubscribe(sub);
    }, [liveReloadDispatcher]);

    const [loadedInstrument] = useState(() => ProjectInstrumentsHandler.loadInstrumentByName(project, instrumentFrame.instrumentName));

    const iframeRef = useRef<HTMLIFrameElement>();
    const lastUpdate = useRef(Date.now());

    useEffect(() => {
        if (iframeRef.current) {
            const handle = (ev: KeyboardEvent) => {
                if (ev.key.toUpperCase() === 'ENTER') {
                    setInInteractionMode((old) => !old);
                }
            };

            iframeRef.current.contentWindow.addEventListener('keydown', handle, true);

            const refCopy = iframeRef.current;
            return () => refCopy.contentWindow.removeEventListener('keydown', handle);
        }

        return null;
    }, [setInInteractionMode]);

    const doLoadInstrument = useCallback(() => {
        if (iframeRef.current && loadedInstrument.config.name) {
            const iframeWindow = iframeRef.current.contentWindow;
            const iframeDocument = iframeRef.current.contentDocument;

            iframeDocument.body.style.overflow = 'hidden';

            Object.assign(iframeRef.current.contentWindow, new LocalShim());

            const rootTag = iframeDocument.createElement('div');
            rootTag.id = 'ROOT_ELEMENT';

            const mountTag = iframeDocument.createElement('div');
            mountTag.id = 'MSFS_REACT_MOUNT';

            rootTag.append(mountTag);

            const pfdTag = iframeDocument.createElement(`${project.name}-${instrumentFrame.instrumentName}`);
            pfdTag.setAttribute('url', 'a?Index=1');

            const scriptTag = iframeDocument.createElement('script');
            scriptTag.text = loadedInstrument.files[1].contents;

            const styleTag = iframeDocument.createElement('style');
            styleTag.textContent = loadedInstrument.files[0].contents;

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

            iframeDocument.head.innerHTML = '<base href="http://localhost:39511/" />';
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
    }, [loadedInstrument.config.name, loadedInstrument.files]);

    useEffect(doLoadInstrument, [doLoadInstrument]);

    return (
        <PanelCanvasElement<InstrumentFrame>
            element={instrumentFrame}
            title={loadedInstrument.config.name}
            canvasZoom={zoom}
            onDelete={onDelete}
            onUpdate={onUpdate}
        >
            <iframe
                title="Instrument Frame"
                ref={iframeRef}
                width={loadedInstrument.config.dimensions.width}
                height={loadedInstrument.config.dimensions.height}
                style={{ pointerEvents: inInteractionMode ? 'auto' : 'none' }}
            />
        </PanelCanvasElement>
    );
};
