import React, { FC, useRef, MouseEvent, useState, WheelEvent, useEffect } from 'react';

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
            setZoom((zoom) => zoom / 2);
        } else {
            setZoom((zoom) => zoom * 2);
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
            <div ref={canvasElementsContainer}>
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

    const handlePanStart = () => {
        setPanning(true);
    };

    const handlePanStop = () => {
        setPanning(false);
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
        <div>
            <div
                ref={canvasElementRef}
                className="bg-blue-500"
                onMouseDown={handlePanStart}
                onMouseUp={handlePanStop}
                onMouseLeave={handlePanStop}
                onMouseMove={handleMouseMove}
            >
                <div className="py-8">{title}</div>

                {children}
            </div>
        </div>
    );
};
