import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import path from 'path';
import { IconRefresh } from '@tabler/icons';
import { PanelCanvasElement } from '../PanelCanvas';
import { ProjectInstrumentsHandler } from '../../Project/fs/Instruments';
import { InstrumentFrame } from '../../../shared/types/project/canvas/InstrumentFrame';
import { useWorkspace } from '../ProjectHome/WorkspaceContext';
import { useProjectSelector } from '../ProjectHome/Store';
import { WorkspacePanelSelection } from '../ProjectHome/Store/reducers/interactionToolbar.reducer';

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
    onUpdate: (el: InstrumentFrame) => void,
}

export const InstrumentFrameElement: FC<InstrumentFrameElementProps> = ({ instrumentFrame, zoom, onUpdate }) => {
    const inEditMode = useProjectSelector((state) => state.interactionToolbar.panel === WorkspacePanelSelection.Edit);

    const [error, setError] = useState<Error | null>(null);
    const [errorIsInInstrument, setErrorIsInInstrument] = useState(false);

    const { engine, project, liveReloadDispatcher, inInteractionMode, setInInteractionMode } = useWorkspace();

    const [loadedInstrument] = useState(() => ProjectInstrumentsHandler.loadInstrumentByName(project, instrumentFrame.instrumentName));

    const [overrideWidth, setOverrideWidth] = useState(loadedInstrument.config.dimensions.width);
    const [overrideHeight, setOverrideHeight] = useState(loadedInstrument.config.dimensions.height);

    const iframeRef = useRef<HTMLIFrameElement>();

    useEffect(() => {
        if (iframeRef.current) {
            const handle = (ev: KeyboardEvent) => {
                if (ev.key.toUpperCase() === 'ENTER') {
                    setInInteractionMode((old) => !old);
                }
            };

            iframeRef.current.contentWindow.addEventListener('keydown', handle, true);

            const refCopy = iframeRef.current;
            return () => refCopy.contentWindow?.removeEventListener('keydown', handle);
        }

        return null;
    }, [setInInteractionMode]);

    const doLoadInstrument = useCallback(() => {
        console.log(`[InstrumentFrameElement(${instrumentFrame.title})] Loading instrument into iframe.`);

        try {
            if (iframeRef.current && loadedInstrument.config.name) {
                engine.loadInstrument({
                    displayName: loadedInstrument.config.name,
                    elementName: 'ace-instrument',
                    jsSource: loadedInstrument.files[1].contents,
                    cssSource: loadedInstrument.files[0].contents,
                }, iframeRef.current, {
                    onInstrumentError: (error) => {
                        setError(error);
                        setErrorIsInInstrument(true);
                    },
                });
            }
        } catch (e) {
            setError(e);
            setErrorIsInInstrument(false);
        }
    }, [engine, instrumentFrame.title, loadedInstrument.config.name, loadedInstrument.files]);

    useEffect(doLoadInstrument, [doLoadInstrument]);

    useEffect(() => {
        console.log(`[InstrumentFrameElement(${instrumentFrame.title})] Hooking into a new LiveReloadDispatcher.`);

        const sub = liveReloadDispatcher.subscribe(instrumentFrame.instrumentName, (fileName, contents) => {
            console.log(`[InstrumentFrameElement(${instrumentFrame.title})] File updated: ${fileName}.`);

            loadedInstrument.files.find((file) => file.name === path.basename(fileName)).contents = contents;

            doLoadInstrument();
        });

        return () => liveReloadDispatcher.unsubscribe(sub);
    }, [doLoadInstrument, instrumentFrame.instrumentName, instrumentFrame.title, liveReloadDispatcher, loadedInstrument.files]);

    return (
        <PanelCanvasElement<InstrumentFrame>
            element={instrumentFrame}
            title={loadedInstrument.config.name}
            initialWidth={overrideWidth ?? loadedInstrument.config.dimensions.width ?? 1000}
            initialHeight={overrideHeight ?? loadedInstrument.config.dimensions.height ?? 800}
            canvasZoom={zoom}
            onUpdate={onUpdate}
            resizingEnabled={inEditMode}
            onResizeCompleted={(width, height) => {
                setOverrideWidth(width);
                setOverrideHeight(height);
            }}
            topBarButtons={(
                <>
                    <IconRefresh className="hover:text-green-500 hover:cursor-pointer" onMouseDown={() => doLoadInstrument()} />
                </>
            )}
        >
            {error ? (
                <div className="h-full flex flex-col justify-center gap-y-2.5 p-5 bg-gray-900">
                    <span className="text-2xl font-bold">{errorIsInInstrument ? 'Error in instrument' : 'Error while loading instrument'}</span>
                    <p className="text-xl">
                        {errorIsInInstrument
                            ? 'This error occurred in instrument code and was not recovered.'
                            : 'This error occurred while ACE was loading the instrument.'}
                    </p>

                    <pre className="w-full flex-grow px-6 py-5 bg-gray-800 text-red-500 overflow-auto">
                        {error.stack}
                    </pre>
                </div>
            ) : (
                <iframe
                    title="Instrument Frame"
                    ref={iframeRef}
                    width={overrideWidth ?? loadedInstrument.config.dimensions.width ?? 1000}
                    height={overrideHeight ?? loadedInstrument.config.dimensions.height ?? 1000}
                    style={{ pointerEvents: inInteractionMode ? 'auto' : 'none' }}
                />
            )}
        </PanelCanvasElement>
    );
};
