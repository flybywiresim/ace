import React, { FC } from 'react';
import { InteractionToolbar } from './InteractionToolbar';
import { PanelCanvas } from '../PanelCanvas';
import { InstrumentFrameElement } from '../Canvas/InstrumentFrameElement';
import { PossibleCanvasElements } from '../../../shared/types/project/canvas/CanvasSaveFile';

export interface WorkspaceProps {
    canvasElements: PossibleCanvasElements[];
    onDeleteCanvasElement: (element: PossibleCanvasElements) => void;
}

export const Workspace: FC<WorkspaceProps> = ({ canvasElements, onDeleteCanvasElement }) => (
    <>
        <div className="absolute z-50 p-7">
            <InteractionToolbar />
        </div>

        <div className="relative w-full h-full z-40">
            <PanelCanvas render={(zoom) => (
                <>
                    {canvasElements.map((canvasElement) => {
                        if (canvasElement.__kind === 'instrument') {
                            return (
                                <InstrumentFrameElement
                                    key={canvasElement.title}
                                    instrumentFrame={canvasElement}
                                    zoom={zoom}
                                    onDelete={() => onDeleteCanvasElement(canvasElement)}
                                />
                            );
                        }

                        return null;
                    })}
                </>
            )}
            />
        </div>
    </>
);
