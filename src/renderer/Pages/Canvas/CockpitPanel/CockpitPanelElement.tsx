import React, { FC, useState } from 'react';
import { PanelCanvasElement } from '../../PanelCanvas';
import { CockpitPanel } from '../../../../shared/types/project/canvas/CockpitPanel';
import { CockpitPanelPushButtonEditor } from './CockpitPanelPushButtonEditor';
import { useProjectSelector } from '../../ProjectHome/Store';
import { WorkspacePanelSelection } from '../../ProjectHome/Store/reducers/interactionToolbar.reducer';

export interface CockpitPanelElementProps {
    panel: CockpitPanel,
    canvasZoom: number,
}

export const CockpitPanelElement: FC<CockpitPanelElementProps> = ({ panel, canvasZoom }) => {
    const pb1: CockpitPanelPushButton = {
        text: 'HYD G PMP',
        topLegend: 'FAULT',
        bottomLegend: 'OFF',
    };

    const pb2: CockpitPanelPushButton = {
        text: 'HYD B PMP',
        topLegend: 'FAULT',
        bottomLegend: 'OFF',
    };

    const pb3: CockpitPanelPushButton = {
        text: 'HYD Y PMP',
        topLegend: 'FAULT',
        bottomLegend: 'OFF',
    };

    return (
        <PanelCanvasElement
            element={panel}
            title={panel.title}
            initialWidth={500}
            initialHeight={250}
            canvasZoom={canvasZoom}
        >
            <div className="w-full h-full bg-gray-800 p-7 flex flex-wrap">
                <CockpitPanelPushButtonElement pushButton={pb1} />
                <CockpitPanelPushButtonElement pushButton={pb2} />
                <CockpitPanelPushButtonElement pushButton={pb3} />
            </div>
        </PanelCanvasElement>
    );
};

export interface CockpitPanelPushButton {
    text?: string,
    topLegend?: string,
    bottomLegend?: string,
}

export const CockpitPanelPushButtonRender: FC<CockpitPanelPushButton> = ({ text, topLegend, bottomLegend }) => (
    <svg className="w-[60px]" viewBox="0 0 50 50">
        <rect x={0} y={0} width={50} height={50} fill="#111" stroke="#333" strokeWidth={3.5} />

        <text x={25} y={21} textAnchor="middle" fill="white" fontSize={13}>{topLegend}</text>
        <text x={25} y={41} textAnchor="middle" fill="white" fontSize={13}>{bottomLegend}</text>
    </svg>
);

interface CockpitPanelPushButtonElementProps {
    pushButton: CockpitPanelPushButton,
}

const CockpitPanelPushButtonElement: FC<CockpitPanelPushButtonElementProps> = ({ pushButton }) => {
    const inEditMode = useProjectSelector((state) => state.interactionToolbar.panel === WorkspacePanelSelection.Edit);

    const [edit, setEdit] = useState(false);

    return (
        <div className="w-[90px] mx-2 flex flex-col items-center gap-y-2">
            <span className="text-[17px] text-center">{pushButton.text}</span>

            <CockpitPanelPushButtonRender {...pushButton} />

            {inEditMode && (
                <button type="button" onClick={() => setEdit((old) => !old)}>bruh</button>
            )}

            {edit && (
                <div className="p-0 m-0 absolute inline-block" style={{ transform: 'translateY(150px)' }}>
                    <CockpitPanelPushButtonEditor pushButton={pushButton} onClose={() => setEdit(false)} />
                </div>
            )}
        </div>
    );
};
