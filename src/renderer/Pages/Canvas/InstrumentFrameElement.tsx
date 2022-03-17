import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { IconRefresh } from '@tabler/icons';
import { PanelCanvasElement } from '../PanelCanvas';
import { ProjectInstrumentsHandler } from '../../Project/fs/Instruments';
import { InstrumentFrame } from '../../../shared/types/project/canvas/InstrumentFrame';
import { useWorkspace } from '../ProjectHome/WorkspaceContext';
import { useProjectDispatch, useProjectSelector } from '../ProjectHome/Store';
import { WorkspacePanelSelection } from '../ProjectHome/Store/reducers/interactionToolbar.reducer';
import {
    BundledInstrumentData, InstrumentData,
    WebInstrumentData,
} from '../../../../ace-engine/src/InstrumentData';
import { InputField } from '../ProjectHome/Components/Framework/InputField';
import { clearCoherentEventsForUniqueID } from '../ProjectHome/Store/actions/coherent.actions';
import { updateCanvasElement } from '../ProjectHome/Store/actions/canvas.actions';

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
}

function bundleInstrumentData(instrument: Instrument): BundledInstrumentData {
    if (!instrument.files[0]) {
        throw new Error('Expected CSS bundle file in instrument');
    }

    if (!instrument.files[1]) {
        throw new Error('Expected JavaScript bundle file in instrument');
    }

    return {
        __kind: 'bundled',
        uniqueID: instrument.config.name,
        displayName: instrument.config.name,
        elementName: 'ace-instrument',
        dimensions: instrument.config.dimensions,
        jsSource: {
            fileName: instrument.files[1].name,
            contents: instrument.files[1].contents,
        },
        cssSource: {
            fileName: instrument.files[0].name,
            contents: instrument.files[0].contents,
        },
    };
}

function webInstrumentData(url: string, config: InstrumentConfig): WebInstrumentData {
    return {
        __kind: 'web',
        uniqueID: config.name,
        displayName: config.name,
        elementName: 'ace-instrument',
        dimensions: config.dimensions,
        url,
    };
}

export const InstrumentFrameElement: FC<InstrumentFrameElementProps> = ({ instrumentFrame, zoom }) => {
    const projectDispatch = useProjectDispatch();

    const inEditMode = useProjectSelector((state) => state.interactionToolbar.panel === WorkspacePanelSelection.Edit);

    const [error, setError] = useState<Error | null>(null);
    const [errorIsInInstrument, setErrorIsInInstrument] = useState(false);

    const { engine, project, liveReloadDispatcher, inInteractionMode, setInInteractionMode } = useWorkspace();

    const [loadedInstrument] = useState<InstrumentData>(() => {
        try {
            if (instrumentFrame.dataKind === 'web') {
                return webInstrumentData(instrumentFrame.url, {
                    index: '<none>',
                    isInteractive: true,
                    name: instrumentFrame.title,
                    dimensions: {
                        width: 768,
                        height: 768,
                    },
                });
            }

            return bundleInstrumentData(ProjectInstrumentsHandler.loadInstrumentByName(project, instrumentFrame.instrumentName));
        } catch (e) {
            setError(e);
            setErrorIsInInstrument(false);

            return {
                __kind: 'web',
                url: '',
                uniqueID: `Unknown-${Math.round(Math.random() * 10_000)}`,
                displayName: 'Unknown',
                elementName: 'ace-instrument',
                dimensions: {
                    width: 768,
                    height: 768,
                },
            };
        }
    });

    const [overrideWidth, setOverrideWidth] = useState(loadedInstrument.dimensions.width ?? 1000);
    const [overrideHeight, setOverrideHeight] = useState(loadedInstrument.dimensions.height ?? 1000);

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
        projectDispatch(clearCoherentEventsForUniqueID(loadedInstrument.uniqueID));

        setError(null);
        setErrorIsInInstrument(false);

        console.log(`[InstrumentFrameElement(${instrumentFrame.title})] Loading instrument into iframe.`);

        try {
            if (iframeRef.current && (instrumentFrame.dataKind === 'bundled' && loadedInstrument.__kind === 'bundled') && loadedInstrument.displayName) {
                engine.loadBundledInstrument(
                    loadedInstrument,
                    iframeRef.current, {
                        onInstrumentError: (error) => {
                            setError(error);
                            setErrorIsInInstrument(true);
                        },
                    },
                );
            } else if (instrumentFrame.dataKind === 'web' && loadedInstrument.__kind === 'web') {
                engine.loadWebInstrument({ ...loadedInstrument, url: 'http://localhost:39511/' }, iframeRef.current, {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...Object.values(loadedInstrument), instrumentFrame.title, instrumentFrame.dataKind === 'web' && instrumentFrame.url]);

    useEffect(() => {
        doLoadInstrument();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doLoadInstrument, instrumentFrame.dataKind, instrumentFrame.dataKind === 'web' && instrumentFrame.url]);

    const jsSourceDep = loadedInstrument.__kind === 'bundled' && loadedInstrument.jsSource;
    const cssSourceDep = loadedInstrument.__kind === 'bundled' && loadedInstrument.cssSource;

    useEffect(() => {
        if (!liveReloadDispatcher) {
            return () => {};
        }

        if (instrumentFrame.dataKind === 'bundled' && loadedInstrument.__kind === 'bundled') {
            console.log(`[InstrumentFrameElement(${instrumentFrame.title})] Hooking into a new LiveReloadDispatcher.`);

            const sub = liveReloadDispatcher.subscribe(instrumentFrame.instrumentName, (fileName, contents) => {
                console.log(`[InstrumentFrameElement(${instrumentFrame.title})] File updated: ${fileName}.`);

                if (loadedInstrument.jsSource.fileName === fileName) {
                    loadedInstrument.jsSource.contents = contents;
                }

                if (loadedInstrument.cssSource.fileName === fileName) {
                    loadedInstrument.cssSource.contents = contents;
                }

                doLoadInstrument();
            });

            return () => liveReloadDispatcher.unsubscribe(sub);
        }

        return () => {};
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [doLoadInstrument, ...Object.values(instrumentFrame), liveReloadDispatcher, jsSourceDep, cssSourceDep]);

    const handleApplyWebInstrumentUrl = (url: string) => {
        if (instrumentFrame.dataKind === 'web') {
            projectDispatch(updateCanvasElement({ ...instrumentFrame, url }));
        }
    };

    return (
        <PanelCanvasElement<InstrumentFrame>
            element={instrumentFrame}
            title={loadedInstrument.displayName}
            initialWidth={overrideWidth ?? loadedInstrument.dimensions.width ?? 1000}
            initialHeight={overrideHeight ?? loadedInstrument.dimensions.height ?? 800}
            canvasZoom={zoom}
            resizingEnabled={inEditMode}
            onResizeCompleted={(width, height) => {
                setOverrideWidth(width);
                setOverrideHeight(height);
            }}
            topBarContent={(
                <>
                    {instrumentFrame.dataKind === 'web' && (
                        <pre className="bg-gray-700 px-1.5">{instrumentFrame.url ?? '(No URL)'}</pre>
                    )}

                    <IconRefresh
                        size={22}
                        className="hover:text-green-500 hover:cursor-pointer"
                        onMouseDown={() => doLoadInstrument()}
                    />
                </>
            )}
        >
            {instrumentFrame.dataKind === 'web' && !instrumentFrame.url && (
                <WebInstrumentNoUrlPanel onApply={handleApplyWebInstrumentUrl} />
            )}

            {error && (
                <div className="h-full flex flex-col justify-center gap-y-2.5 p-5 bg-gray-900">
                    <span
                        className="text-2xl font-bold"
                    >
                        {errorIsInInstrument ? 'Error in instrument' : 'Error while loading instrument'}
                    </span>
                    <p className="text-xl">
                        {errorIsInInstrument
                            ? 'This error occurred in instrument code and was not recovered.'
                            : 'This error occurred while ACE was loading the instrument.'}
                    </p>

                    <pre className="w-full flex-grow px-6 py-5 bg-gray-800 text-red-500 overflow-auto">
                        {error.stack}
                    </pre>
                </div>
            )}

            <iframe
                title="Instrument Frame"
                name={instrumentFrame.dataKind === 'web' ? instrumentFrame.url : undefined}
                ref={iframeRef}
                width={overrideWidth ?? loadedInstrument.dimensions.width}
                height={overrideHeight ?? loadedInstrument.dimensions.height}
                style={{ pointerEvents: inInteractionMode ? 'auto' : 'none', visibility: error ? 'hidden' : 'visible', backgroundColor: '#000' }}
            />
        </PanelCanvasElement>
    );
};

interface WebInstrumentNoUrlPanelProps {
    onApply: (url: string) => void,
}

const WebInstrumentNoUrlPanel: FC<WebInstrumentNoUrlPanelProps> = ({ onApply }) => {
    const [urlInput, setUrlInput] = useState('');

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        setUrlInput(e.currentTarget.value);
    };

    return (
        <div className="h-full flex flex-col justify-center gap-y-3 p-5 bg-gray-900 items-center">
            <span className="text-2xl font-bold">No URL configured</span>
            <p className="text-xl">
                Configure the URL to display in this instrument below.
            </p>

            <div className="flex gap-x-2 5">
                <InputField
                    className="w-[300px]"
                    type="text"
                    placeholder="http://..."
                    onInput={handleInput}
                />

                <button className="w-36" type="button" disabled={!urlInput} onClick={() => onApply(urlInput)}>Apply</button>
            </div>
        </div>
    );
};
