import React, { useRef, MouseEvent, useState, useEffect, useCallback, WheelEvent, PropsWithChildren } from 'react';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { IconTrash, IconArrowsMaximize } from '@tabler/icons';
import { useThrottle } from 'react-use';
import useInterval from '../../utils/useInterval';
import { useWorkspace } from './ProjectHome/WorkspaceContext';
import { PossibleCanvasElements } from '../../shared/types/project/canvas/CanvasSaveFile';
import { GRID_LINE_SIZE, GRID_SVG_SIZE } from './Canvas/Grid';

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
                velocityAnimation={{
                    disabled: true,
                    sensitivity: 0,
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
    canvasZoom: number;
    onUpdate: (el: T) => void;
}

export const PanelCanvasElement = <T extends PossibleCanvasElements>({
    element,
    title,
    canvasZoom,
    onUpdate,
    children,
}: PropsWithChildren<PanelCanvasElementProps<T>>) => {
    const [offsetX, setOffsetX] = useState(() => element.position.x);
    const [offsetY, setOffsetY] = useState(() => element.position.y);

    const throttledOffsetX = useThrottle(offsetX, 750);
    const throttledOffsetY = useThrottle(offsetY, 750);

    const TITLE_FONTSIZE = 14;

    const roundToGrid = (input: number): number => {
        const PROJECTED_GRID_CELL_SIZE = (PANEL_CANVAS_SIZE / GRID_SVG_SIZE) * GRID_LINE_SIZE;

        return Math.round(input / PROJECTED_GRID_CELL_SIZE) * PROJECTED_GRID_CELL_SIZE;
    };

    // Handle updating the saved element when the throttled position is updated
    useEffect(() => {
        onUpdate({ ...element, position: { x: throttledOffsetX, y: throttledOffsetY } });
    }, [element, onUpdate, throttledOffsetX, throttledOffsetY]);

    const [editPositionX, setEditPositionX] = useState(() => element.position.x);
    const [editPositionY, setEditPositionY] = useState(() => element.position.y);

    // Handle setting element position as edit movement changes
    useEffect(() => {
        setOffsetX(roundToGrid(editPositionX));
        setOffsetY(roundToGrid(editPositionY));
    }, [editPositionX, editPositionY]);

    const { inEditMode } = useWorkspace();

    const canvasElementRef = useRef<HTMLDivElement>(null);

    const handlePanStart = (event: MouseEvent) => {
        document.body.addEventListener('mouseup', handlePanStop);
        document.body.addEventListener('mousemove', handleMouseMove);
        event.stopPropagation();
    };

    const handlePanStop = (event: globalThis.MouseEvent) => {
        document.body.removeEventListener('mouseup', handlePanStop);
        document.body.removeEventListener('mousemove', handleMouseMove);
        event.stopPropagation();
    };

    const handleMouseMove = (event: globalThis.MouseEvent) => {
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

    return (
        <span className="absolute" onMouseDown={handleMouseDown}>
            <span
                ref={canvasElementRef}
                className="shadow-md"
                style={{
                    position: 'absolute',
                    transitionDuration: '0.1s',
                    transform: `translate(${(PANEL_CANVAS_SIZE / 2) + offsetX}px, ${(PANEL_CANVAS_SIZE / 2) + offsetY}px)`,
                }}
            >
                <span className="absolute flex flex-row h-12 -top-16 justify-between items-center">
                    <h1 style={{ fontSize: `${TITLE_FONTSIZE * (1 / canvasZoom)}px` }}>{title}</h1>

                    {inEditMode && (
                        <IconArrowsMaximize className="hover:text-red-500 hover:cursor-pointer" onMouseDown={handlePanStart} />
                    )}
                </span>

                <span className="block border border-[#00c2cc] hover:border-green-500 overflow-hidden">
                    {children}
                </span>
            </span>
        </span>
    );
};
