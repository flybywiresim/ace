import React, { FC } from 'react';
import { IconCircle, IconCircleCheck, IconPencil } from '@tabler/icons';
import { SimVarPreset } from '../../../../../../shared/types/project/SimVarPreset';

export interface SimVarPresetEntryProps {
    preset: SimVarPreset,
    active: boolean,
}

export const SimVarPresetElement: FC<SimVarPresetEntryProps> = ({ preset, active }) => (
    <div
        className={`bg-navy-lighter flex flex-row items-center gap-x-5 px-4 py-2.5 border-2 ${active ? 'border-green-500' : 'border-transparent'} rounded-md shadow-md`}
    >
        {active ? (
            <IconCircleCheck size={26} className="text-green-500" />
        ) : (
            <IconCircle size={26} className="text-gray-500" />
        )}

        <div className="flex flex-col gap-y-1">
            <div className="flex items-center">
                <h2>{preset.title}</h2>
            </div>

            <div className="flex items-center">
                <h4 className="text-gray-400">0 variables</h4>
            </div>
        </div>

        <IconPencil size={28} className="ml-auto text-gray-500 cursor-pointer hover:text-teal" />
    </div>
);
