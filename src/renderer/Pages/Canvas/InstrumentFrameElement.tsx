import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { IconCamera, IconRefresh } from '@tabler/icons';
import { Toggle } from '@flybywiresim/react-components';
import rasterizeHTML from 'rasterizehtml';
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
import { setInteractionMode } from '../ProjectHome/Store/actions/interaction.actions';
import { LiveReloadDispatcher } from '../../Project/live-reload/LiveReloadDispatcher';
import { useAppDispatch } from '../../Store';
import { pushNotification } from '../../Store/actions/notifications.actions';

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
            path: instrument.files[1].path,
            contents: instrument.files[1].contents,
        },
        cssSource: {
            fileName: instrument.files[0].name,
            path: instrument.files[0].path,
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
    const appDispatch = useAppDispatch();
    const projectDispatch = useProjectDispatch();

    const inEditMode = useProjectSelector((state) => state.interactionToolbar.panel === WorkspacePanelSelection.Edit);

    const [error, setError] = useState<Error | null>(null);
    const [errorIsInInstrument, setErrorIsInInstrument] = useState(false);

    const { engine, project } = useWorkspace();

    const inInteractionMode = useProjectSelector((state) => state.interaction.inInteractionMode);

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
                    projectDispatch(setInteractionMode(!inInteractionMode));
                }
            };

            iframeRef.current.contentWindow.addEventListener('keydown', handle, true);

            const refCopy = iframeRef.current;
            return () => refCopy.contentWindow?.removeEventListener('keydown', handle);
        }

        return null;
    }, [inInteractionMode, projectDispatch]);

    const doLoadInstrument = useCallback(() => {
        projectDispatch(clearCoherentEventsForUniqueID(loadedInstrument.uniqueID));

        setError(null);
        setErrorIsInInstrument(false);

        console.log(`[InstrumentFrameElement(${instrumentFrame.title})] Loading instrument into iframe.`);

        try {
            if (iframeRef.current && (instrumentFrame.dataKind === 'bundled' && loadedInstrument.__kind === 'bundled') && loadedInstrument.displayName) {
                // TODO: this is a bit weird
                const newInstrument = bundleInstrumentData(ProjectInstrumentsHandler.loadInstrumentByName(project, instrumentFrame.instrumentName));
                loadedInstrument.jsSource.contents = newInstrument.jsSource.contents;
                loadedInstrument.cssSource.contents = newInstrument.cssSource.contents;
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

    const [liveReloadDispatcher] = useState<LiveReloadDispatcher | null>(loadedInstrument.__kind === 'bundled' ? new LiveReloadDispatcher(loadedInstrument) : null);

    useEffect(() => {
        if (!liveReloadDispatcher) {
            return () => {};
        }

        if (instrumentFrame.dataKind === 'bundled' && loadedInstrument.__kind === 'bundled') {
            console.log(`[InstrumentFrameElement(${instrumentFrame.title})] Hooking into a new LiveReloadDispatcher.`);

            const sub = liveReloadDispatcher.subscribe(instrumentFrame.instrumentName, (fileName) => {
                console.log(`[InstrumentFrameElement(${instrumentFrame.title})] File updated: ${fileName}.`);
                // TODO: This function is called for each file, so its going to reload the instrument twice, once for css once for js, needs a clean

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

    const [liveReloadActive, setLiveReloadActive] = useState(false);

    useEffect(() => {
        if (liveReloadActive) {
            liveReloadDispatcher?.startWatching();
        } else {
            liveReloadDispatcher?.stopWatching();
        }
    }, [liveReloadDispatcher, liveReloadActive]);

    const handleScreenshotInstrument = () => {
        if (!iframeRef.current) {
            console.warn('(!) Cannot screenshot when no iframe instance');
            return;
        }

        const canvas = document.createElement('canvas');

        // TODO allow user to change the res
        canvas.width = overrideWidth;
        canvas.height = overrideHeight;

        canvas.getContext('2d').fillStyle = 'rgb(0, 0, 0)';
        canvas.getContext('2d').fillRect(0, 0, canvas.width, canvas.height);

        const iframeDoc = iframeRef.current.contentDocument;

        // Replace canvasses with images
        const canvasElements = iframeDoc.querySelectorAll('canvas');

        for (const canvas of canvasElements) {
            const dataUrl = canvas.toDataURL();

            const img = iframeDoc.createElement('img');
            img.width = canvas.width;
            img.height = canvas.height;
            img.src = dataUrl;
            (canvas as any).replacementImg = img;

            canvas.replaceWith(img);
        }

        rasterizeHTML.drawDocument(iframeDoc, canvas).then(() => {
            // Restore canvasses
            for (const canvas of canvasElements) {
                const img = (canvas as any).replacementImg;

                img.replaceWith(canvas);
            }

            const dataUrl = canvas.toDataURL();
            const buffer = Buffer.from(dataUrl.split(',')[1], 'base64');

            const blob = new Blob([buffer], {
                type: 'image/png',
            });

            // @ts-ignore
            navigator.clipboard.write([new ClipboardItem({
                [blob.type]: blob,
            })]);

            appDispatch(pushNotification(`Screenshot (${canvas.width}x${canvas.height}) copied to clipboard`));
        });
    };

    return (
        <PanelCanvasElement<InstrumentFrame>
            id={`ace-instrument-${loadedInstrument.uniqueID}`}
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
                    <Toggle
                        value={liveReloadActive}
                        onToggle={() => setLiveReloadActive((value) => !value)}
                    />
                    <IconCamera
                        size={22}
                        className="hover:text-green-500 hover:cursor-pointer"
                        onMouseDown={() => handleScreenshotInstrument()}
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
                name={instrumentFrame.dataKind === 'web' ? instrumentFrame.url : loadedInstrument.uniqueID}
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
