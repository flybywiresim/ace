import React, { FC, useState } from 'react';
import { IconPlus } from '@tabler/icons';
import { useWorkspace } from '../../../WorkspaceContext';
import { SimVarPresetElement } from './SimVarPresetElement';

export const SimVarPresetsMenu: FC = () => {
    const { handlers: { simVarPresetsHandler } } = useWorkspace();

    const [simVarPresets] = useState(() => simVarPresetsHandler.loadConfig().elements);

    return (
        <div className="flex flex-col gap-y-3.5">
            {simVarPresets.map((preset) => (
                <>
                    <SimVarPresetElement preset={preset} active />
                    <SimVarPresetElement preset={preset} active={false} />
                </>
            ))}

            <div className="flex flex-row justify-center items-center gap-x-2 py-3 border-2 border-dashed text-gray-500 border-gray-500 rounded-md">
                <IconPlus size={30} />

                <span className="text-xl">Add SimVar Preset</span>
            </div>
        </div>
    );
};
