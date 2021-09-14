import React, { FC, useRef, MouseEvent, useState, useEffect, useCallback, WheelEvent } from 'react';
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { IconTrash, IconArrowsMaximize } from '@tabler/icons';
import useInterval from '../../utils/useInterval';
import { useWorkspace, WorkspaceMode } from './ProjectHome';

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

    const { mode } = useWorkspace();

    const canvasElementRef = useRef<HTMLDivElement>(null);

    const handlePanStart = (event: MouseEvent) => {
        console.log('starting pan');
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
        setOffsetX((old) => { 
            setOffsetY((old1) => {
                canvasElementRef.current.style.transform = `translate(${old + event.movementX / canvasZoom}px, ${old1 + event.movementY / canvasZoom}px)`;
                return (old1 + event.movementY / canvasZoom * 0.65)
            });
            return (old + event.movementX / canvasZoom * 0.65)
        });
        event.stopPropagation();
    };

    return (
        <span className="absolute">
            <span
                ref={canvasElementRef}
                style={{ position: 'absolute' }}
            >
                {mode === WorkspaceMode.Edit && 
                    <span className="flex flex-row justify-between items-center mb-5">
                        <h1 className="text-3xl">{title}</h1>

                        <IconArrowsMaximize className="hover:text-red-500 hover:cursor-pointer" onMouseDown={handlePanStart} />
                        <IconTrash className="hover:text-red-500 hover:cursor-pointer" onClick={onDelete} />
                    </span>
                }

                <span className={`block ${mode === WorkspaceMode.Edit && 'border-2 border-[#00c2cc]'} overflow-hidden`}>
                    {children}
                </span>
            </span>
        </span>
    );
};
