import React, { MouseEvent, PropsWithChildren, useCallback, useEffect, useRef, useState, WheelEvent } from 'react';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { IconArrowsMaximize } from '@tabler/icons';
import { useThrottle } from 'react-use';
import useInterval from '../../utils/useInterval';
import { PossibleCanvasElements } from '../../shared/types/project/canvas/CanvasSaveFile';
import { GRID_LINE_SIZE, GRID_SVG_SIZE } from './Canvas/Grid';
import { useProjectSelector } from './ProjectHome/Store';
import { WorkspacePanelSelection } from './ProjectHome/Store/reducers/interactionToolbar.reducer';

export const PANEL_CANVAS_SIZE = 30_000;

export interface PanelCanvasRenderProps {
    zoom: number;
}

export interface PanelCanvasProps {
    render: (props: PanelCanvasRenderProps) => JSX.Element;
}

export const PanelCanvas = ({ render }: PanelCanvasProps) => {
    const transformContainerRef = useRef<HTMLElement>(null);
    const transformWrapperRef = useRef<ReactZoomPanPinchRef>(null);
    const transformContentRef = useRef<HTMLElement>(null);

    const [zoom, setZoom] = useState(1);
    const [, setOffsetX] = useState(0);
    const [, setOffsetY] = useState(0);

    useInterval(() => {
        if (transformWrapperRef.current) {
            setZoom(transformWrapperRef.current.state.scale);
            setOffsetX(transformWrapperRef.current.state.positionX);
            setOffsetY(transformWrapperRef.current.state.positionY);
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
                const wheelEvent = new globalThis.MouseEvent('dblclick', { clientX: currentDoubleClickX, clientY: currentDoubleClickY });

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
        <section className="w-full h-full bg-gray-900 overflow-hidden" ref={transformContainerRef} onWheel={handleWheel}>
            <TransformWrapper
                ref={transformWrapperRef}
                limitToBounds
                initialPositionX={-PANEL_CANVAS_SIZE / 2}
                initialPositionY={-PANEL_CANVAS_SIZE / 2}
                minScale={0.045}
                panning={{
                    velocityDisabled: true,
                }}
                doubleClick={{
                    mode: currentDoubleClickMode,
                    step: 0.4,
                }}
                wheel={{
                    disabled: true,
                }}
            >
                <TransformComponent
                    wrapperStyle={{
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <div style={{
                        overflow: 'hidden',
                        width: `${PANEL_CANVAS_SIZE}px`,
                        height: `${PANEL_CANVAS_SIZE}px`,
                    }}
                    >
                        {render({ zoom })}
                    </div>
                </TransformComponent>
            </TransformWrapper>
        </section>
    );
};

export interface PanelCanvasElementProps<T extends PossibleCanvasElements> {
    element: T,
    title?: string;
    initialWidth: number,
    initialHeight: number,
    canvasZoom: number;
    onUpdate: (el: T) => void;
    resizingEnabled?: boolean,
    onResizeCompleted?: (width: number, height: number) => void,
    topBarContent?: JSX.Element;
}

export const PanelCanvasElement = <T extends PossibleCanvasElements>({
    element,
    title,
    initialWidth,
    initialHeight,
    canvasZoom,
    onUpdate,
    resizingEnabled,
    onResizeCompleted,
    topBarContent,
    children,
}: PropsWithChildren<PanelCanvasElementProps<T>>) => {
    const xResizeOriginalPos = useRef(0);
    const yResizeOriginalPos = useRef(0);
    const resizeMode = useRef<'x' | 'y' | 'xy' | null>(null);

    const [width, setWidth] = useState(initialWidth);
    const [height, setHeight] = useState(initialHeight);

    const [offsetX, setOffsetX] = useState(() => element.position.x);
    const [offsetY, setOffsetY] = useState(() => element.position.y);

    const throttledOffsetX = useThrottle(offsetX, 750);
    const throttledOffsetY = useThrottle(offsetY, 750);

    const TITLE_FONTSIZE = 18;

    const roundToGrid = (input: number): number => {
        const PROJECTED_GRID_CELL_SIZE = (PANEL_CANVAS_SIZE / GRID_SVG_SIZE) * GRID_LINE_SIZE;

        return Math.round(input / PROJECTED_GRID_CELL_SIZE) * PROJECTED_GRID_CELL_SIZE;
    };

    // Handle updating the saved element when the throttled position is updated
    useEffect(() => {
        onUpdate({ ...element, position: { x: throttledOffsetX, y: throttledOffsetY } });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [element.__uuid, onUpdate, throttledOffsetX, throttledOffsetY]);

    const [editPositionX, setEditPositionX] = useState(() => element.position.x);
    const [editPositionY, setEditPositionY] = useState(() => element.position.y);

    // Handle setting element position as edit movement changes
    useEffect(() => {
        setOffsetX(roundToGrid(editPositionX));
        setOffsetY(roundToGrid(editPositionY));
    }, [editPositionX, editPositionY]);

    const inEditMode = useProjectSelector((state) => state.interactionToolbar.panel === WorkspacePanelSelection.Edit);

    const canvasElementRef = useRef<HTMLDivElement>(null);

    const handlePanStart = (event: MouseEvent) => {
        document.body.addEventListener('mouseup', handlePanStop);
        document.body.addEventListener('mousemove', handlePanMouseMove);
        event.stopPropagation();
    };

    const handlePanStop = (event: globalThis.MouseEvent) => {
        document.body.removeEventListener('mouseup', handlePanStop);
        document.body.removeEventListener('mousemove', handlePanMouseMove);
        event.stopPropagation();
    };

    const handlePanMouseMove = (event: globalThis.MouseEvent) => {
        if (!canvasElementRef.current) {
            return;
        }

        setEditPositionX((old) => old + event.movementX / canvasZoom);
        setEditPositionY((old) => old + event.movementY / canvasZoom);

        event.stopPropagation();
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        (e as any).canvasTarget = element;
    };

    const handleResizeMouseMove = useCallback((e: globalThis.PointerEvent) => {
        if (resizeMode.current.includes('x')) {
            const delta = (e.clientX / canvasZoom) - xResizeOriginalPos.current;

            setWidth(initialWidth + delta);
        }

        if (resizeMode.current.includes('y')) {
            const delta = (e.clientY / canvasZoom) - yResizeOriginalPos.current;

            setHeight(initialHeight + delta);
        }
    }, [canvasZoom, initialWidth, initialHeight]);

    const handleResizeStop = useCallback((event: globalThis.MouseEvent) => {
        document.body.removeEventListener('mouseup', handleResizeStop);
        document.body.removeEventListener('pointermove', handleResizeMouseMove);
        event.stopPropagation();

        // For some reason, width and height do not update fast enough
        onResizeCompleted(canvasElementRef.current.clientWidth, canvasElementRef.current.clientHeight);
    }, [handleResizeMouseMove, onResizeCompleted]);

    const handleResizeStart = useCallback((event: React.MouseEvent, newResizeMode: 'x' | 'y' | 'xy') => {
        document.body.addEventListener('mouseup', handleResizeStop);
        document.body.addEventListener('pointermove', handleResizeMouseMove);
        event.stopPropagation();

        if (newResizeMode.includes('x')) {
            xResizeOriginalPos.current = event.clientX / canvasZoom;
        }

        if (newResizeMode.includes('y')) {
            yResizeOriginalPos.current = event.clientY / canvasZoom;
        }

        resizeMode.current = newResizeMode;
    }, [canvasZoom, handleResizeMouseMove, handleResizeStop]);

    return (
        <span className="absolute" onMouseDown={handleMouseDown}>
            <span
                ref={canvasElementRef}
                className="shadow-md"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    position: 'absolute',
                    // transitionDuration: '0.1s',
                    transform: `translate(${(PANEL_CANVAS_SIZE / 2) + offsetX}px, ${(PANEL_CANVAS_SIZE / 2) + offsetY}px)`,
                }}
            >
                <span className="w-full absolute flex flex-row px-3 bg-gray-800 border-2 border-gray-700 rounded-t-md bg-opacity-80 h-10 -top-10 justify-between items-center">
                    <h1 style={{ fontSize: `${TITLE_FONTSIZE * (1 / canvasZoom)}px` }}>{title}</h1>

                    <div className="flex flex-row flex-grow ml-2">
                        <div className="w-full flex items-center gap-x-2 ml-2.5">
                            {topBarContent}
                        </div>

                        {inEditMode && (
                            <div className="flex flex-row ml-2">
                                <IconArrowsMaximize size={22} className="hover:text-purple-500 hover:cursor-pointer" onMouseDown={handlePanStart} />
                            </div>
                        )}
                    </div>

                </span>

                <span
                    className="block border border-[#00c2cc] hover:border-green-500 overflow-hidden"
                    style={{
                        width: `${width}px`,
                        height: `${height}px`,
                    }}
                >
                    {children}
                </span>

                {resizingEnabled && (
                    <>
                        <span className="absolute top-0 right-[-4px] flex flex-col justify-center" style={{ height: 'calc(100% + 4px)' }}>
                            <span className="absolute w-[4px] h-[40px] bg-green-500" style={{ cursor: 'ew-resize' }} onMouseDown={(e) => handleResizeStart(e, 'x')} />

                            <span className="mt-auto w-[4px] h-[40px] bg-green-500" style={{ cursor: 'nwse-resize' }} onMouseDown={(e) => handleResizeStart(e, 'xy')} />
                        </span>

                        <span className="absolute flex justify-center" style={{ width: 'calc(100% + 4px)' }}>
                            <span className="absolute w-[40px] h-[4px] bg-green-500" style={{ cursor: 'ns-resize' }} onMouseDown={(e) => handleResizeStart(e, 'y')} />

                            <span className="ml-auto w-[40px] h-[4px] bg-green-500" style={{ cursor: 'nwse-resize' }} onMouseDown={(e) => handleResizeStart(e, 'xy')} />
                        </span>
                    </>
                )}
            </span>
        </span>
    );
};
