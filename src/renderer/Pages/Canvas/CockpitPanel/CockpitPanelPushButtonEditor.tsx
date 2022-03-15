import React, { FC } from 'react';
import { CockpitPanelPushButton, CockpitPanelPushButtonRender } from './CockpitPanelElement';

export interface CockpitPanelPushButtonEditorProps {
    pushButton: CockpitPanelPushButton,
    onClose: () => void,
}

export const CockpitPanelPushButtonEditor: FC<CockpitPanelPushButtonEditorProps> = ({ pushButton, onClose }) => (
    <div className="w-[400px] h-[270px] p-0 m-0 flex flex-col bg-gray-700">
        <div className="flex flex-row justify-between">
            bruhegg
            <button type="button" onClick={onClose}>Close</button>
        </div>

        <div className="w-full flex-grow flex flex-row justify-center items-center">
            <CockpitPanelPushButtonRender {...pushButton} />
        </div>

    </div>
);
