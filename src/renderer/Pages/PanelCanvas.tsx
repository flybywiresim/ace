import React, { FC, useRef, MouseEvent, useState, WheelEvent, useEffect } from 'react';

const CANVAS_ZOOM_FACTOR = 1.5;

export interface PanelCanvasProps {
    render: (zoom: number) => JSX.Element;
}

export const PanelCanvas: FC<PanelCanvasProps> = ({ render }) => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (canvasPaneRef.current && canvasElementsContainer.current) {
            canvasElementsContainer.current.childNodes.forEach((node) => {
                if (node instanceof HTMLElement) {
                    node.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                }
            });
        }
    }, [offsetX, offsetY, zoom]);

    useEffect(() => {
        if (canvasElementsContainer.current) {
            canvasElementsContainer.current.style.transform = `scale(${zoom})`;
        }
    }, [zoom]);

    const [isPanning, setPanning] = useState(false);

    const canvasPaneRef = useRef<HTMLDivElement>(null);
    const canvasElementsContainer = useRef<HTMLDivElement>(null);

    const handlePanStart = () => {
        setPanning(true);
    };

    const handlePanStop = () => {
        setPanning(false);
    };

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        if (!isPanning || !canvasPaneRef.current) {
            return;
        }

        setOffsetX((old) => old + event.movementX / zoom);
        setOffsetY((old) => old + event.movementY / zoom);
    };

    const handleZoom = (event: WheelEvent<HTMLDivElement>) => {
        if (event.deltaY >= 0) {
            setZoom((zoom) => zoom / CANVAS_ZOOM_FACTOR);
        } else {
            setZoom((zoom) => zoom * CANVAS_ZOOM_FACTOR);
        }
    };

    return (
        <div
            className="w-full flex-1 bg-black overflow-hidden select-none"
            ref={canvasPaneRef}
            onMouseDown={handlePanStart}
            onMouseUp={handlePanStop}
            onMouseLeave={handlePanStop}
            onMouseMove={handleMouseMove}
            onWheel={handleZoom}
        >
            <div ref={canvasElementsContainer} className="transition-transform">
                {render(zoom)}
            </div>
        </div>
    );
};

export interface PanelCanvasElementProps {
    title?: string;
    canvasZoom: number;
}

export const PanelCanvasElement: FC<PanelCanvasElementProps> = ({ title, canvasZoom, children }) => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const [isPanning, setPanning] = useState(false);

    const canvasElementRef = useRef<HTMLDivElement>(null);

    const handlePanStart = (event: MouseEvent) => {
        setPanning(true);
        event.stopPropagation();
    };

    const handlePanStop = (event: MouseEvent) => {
        setPanning(false);
        event.stopPropagation();
    };

    const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
        if (!isPanning || !canvasElementRef.current) {
            return;
        }

        setOffsetX((old) => old + event.movementX / canvasZoom);
        setOffsetY((old) => old + event.movementY / canvasZoom);

        canvasElementRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        event.stopPropagation();
    };

    return (
        <span className="absolute">
            <span
                ref={canvasElementRef}
                onMouseDown={handlePanStart}
                onMouseUp={handlePanStop}
                onMouseLeave={handlePanStop}
                onMouseMove={handleMouseMove}
                style={{ position: 'absolute' }}
            >
                <h1 className="text-3xl mb-6">{title}</h1>

                <span className="block border-2 border-[#00c2cc] overflow-hidden">
                    {children}
                </span>
            </span>
        </span>
    );
};
