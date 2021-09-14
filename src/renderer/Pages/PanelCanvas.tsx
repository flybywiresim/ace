import React, { FC, useRef, MouseEvent as Bruh, useState, useEffect, useCallback, WheelEvent } from 'react';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { IconTrash } from '@tabler/icons';
import useInterval from '../../utils/useInterval';

export interface PanelCanvasProps {
    render: (zoom: number) => JSX.Element;
}

export const PanelCanvas = ({ render }: PanelCanvasProps) => {
    const transformContainerRef = useRef<HTMLElement>(null);
    const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);
    const transformContentRef = useRef<HTMLElement>(null);

    const [zoom, setZoom] = useState(1);

    useInterval(() => {
        if (transformWrapperRef.current) {
            setZoom(transformWrapperRef.current.state.scale);
        }
    }, 100);

    useEffect(() => {
        const element = document.querySelector('.react-transform-component') as HTMLElement;

        if (element) {
            transformContentRef.current = element;
        }
    }, []);

    const [currentDoubleClickMode, setCurrentDoubleClickMode] = useState<'zoomIn' | 'zoomOut' | 'reset'>('zoomIn');
    const [currentDoubleClickX, setCurrentDoubleClickX] = useState(0);
    const [currentDoubleClickY, setCurrentDoubleClickY] = useState(0);

    const doEmulateDoubleClick = useCallback(() => {
        if (transformContainerRef.current) {
            transformContainerRef.current.childNodes.forEach((node) => {
                const wheelEvent = new MouseEvent('dblclick', { clientX: currentDoubleClickX, clientY: currentDoubleClickY });

                node.dispatchEvent(wheelEvent);
            });
        }
    }, [currentDoubleClickX, currentDoubleClickY]);

    useEffect(doEmulateDoubleClick, [doEmulateDoubleClick, currentDoubleClickMode]);

    const handleWheel = useCallback((event: WheelEvent) => {
        setCurrentDoubleClickX(event.clientX);
        setCurrentDoubleClickY(event.clientY);

        const newDoubleClickMode = event.deltaY > 0 ? 'zoomOut' : 'zoomIn';

        setCurrentDoubleClickMode(newDoubleClickMode);
        if (currentDoubleClickMode === newDoubleClickMode) {
            doEmulateDoubleClick();
        }

        event.stopPropagation();
    }, [currentDoubleClickMode, doEmulateDoubleClick]);

    return (
        <section className="w-full h-full bg-gray-900" ref={transformContainerRef} onWheel={handleWheel}>
            <TransformWrapper
                ref={transformWrapperRef}
                limitToBounds={false}
                minScale={0}
                doubleClick={{
                    mode: currentDoubleClickMode,
                }}
                wheel={{
                    disabled: true,
                }}
            >
                <TransformComponent
                    wrapperStyle={{
                        minWidth: '100%',
                        minHeight: '100%',

                    }}
                >
                    {render(zoom)}
                </TransformComponent>
            </TransformWrapper>
        </section>
    );
};

export interface PanelCanvasElementProps {
    title?: string;
    canvasZoom: number;
    onDelete: () => void;
}

export const PanelCanvasElement: FC<PanelCanvasElementProps> = ({ title, canvasZoom, onDelete, children }) => {
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);

    const [isPanning, setPanning] = useState(false);

    const canvasElementRef = useRef<HTMLDivElement>(null);

    const handlePanStart = (event: Bruh) => {
        setPanning(true);
        event.stopPropagation();
    };

    const handlePanStop = (event: Bruh) => {
        setPanning(false);
        event.stopPropagation();
    };

    const handleMouseMove = (event: Bruh<HTMLDivElement>) => {
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
                <span className="flex flex-row justify-between items-center mb-5">
                    <h1 className="text-3xl">{title}</h1>

                    <IconTrash className="hover:text-red-500 hover:cursor-pointer" onClick={onDelete} />
                </span>

                <span className="block border-2 border-[#00c2cc] overflow-hidden">
                    {children}
                </span>
            </span>
        </span>
    );
};
