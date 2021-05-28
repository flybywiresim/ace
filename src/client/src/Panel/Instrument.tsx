import React, { FC, useEffect, useRef, useState } from 'react';
import { getInstrumentBundle } from '../queries/instruments';
import { LocalShim } from '../shims/LocalShim';
import { PanelInstrument } from '../../../common/panel';

export type InstrumentProps = {
    instrument: PanelInstrument,
    index: number,
    canvas: React.MutableRefObject<HTMLDivElement>,
    scale: number,
    onRemoved: () => void,
}

export const Instrument: FC<InstrumentProps> = ({ instrument, index, scale, canvas, onRemoved }) => {
    const containerRef = useRef<HTMLDivElement>();
    const iframeRef = useRef<HTMLIFrameElement>();

    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (iframeRef && instrument) {
            getInstrumentBundle(instrument.name).then((bundle) => {
                const iframeWindow = iframeRef.current.contentWindow;
                const iframeDocument = iframeRef.current.contentDocument;

                Object.assign(iframeRef.current.contentWindow, new LocalShim());

                const rootTag = iframeDocument.createElement('div');
                rootTag.id = 'ROOT_ELEMENT';

                const mountTag = iframeDocument.createElement('div');
                mountTag.id = 'MSFS_REACT_MOUNT';

                rootTag.append(mountTag);

                const pfdTag = iframeDocument.createElement('a32nx-pfd');
                pfdTag.setAttribute('url', 'a?Index=1');

                const scriptTag = iframeDocument.createElement('script');
                scriptTag.text = bundle.js;

                const styleTag = iframeDocument.createElement('style');
                styleTag.textContent = bundle.css;

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
                    iframeDocument.getElementById('ROOT_ELEMENT').dispatchEvent(new Event('update'));
                }, 50);
            });
        }
    }, [iframeRef, instrument?.name]);

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            if (isDragging) {
                const currentYOffset = containerRef.current.style.top;
                const currentXOffset = containerRef.current.style.left;

                containerRef.current.style.top = `${Number(currentYOffset.replace('px', '')) + event.movementY / scale}px`;
                containerRef.current.style.left = `${Number(currentXOffset.replace('px', '')) + event.movementX / scale}px`;

                event.stopPropagation();
            }
        };

        canvas.current.addEventListener('mousemove', listener);

        return () => canvas.current.removeEventListener('mousemove', listener);
    }, [canvas, isDragging]);

    const handleDragStart = (event: MouseEvent) => {
        setIsDragging(true);

        event.stopPropagation();
    };

    const handleDragStop = (event: MouseEvent) => {
        setIsDragging(false);

        event.stopPropagation();
    };

    return (
        <div
            className="absolute flex flex-col bg-gray-300 p-0 overflow-hidden rounded-t-md shadow-md"
            ref={containerRef}
        >
            <span
                onMouseDown={handleDragStart}
                onMouseUp={handleDragStop}
                className="flex flex-row justify-between hover:bg-gray-400 text-3xl font-medium px-3 py-3 cursor-move"
            >
                {instrument?.name}
                {' '}
                {index}
                <button onClick={onRemoved} type="button">X</button>
            </span>
            <iframe
                title="Instrument Frame"
                ref={iframeRef}
                width={instrument.dimensions.px.width}
                height={instrument.dimensions.px.height}
                style={{ pointerEvents: 'none' }}
            />
        </div>
    );
};
