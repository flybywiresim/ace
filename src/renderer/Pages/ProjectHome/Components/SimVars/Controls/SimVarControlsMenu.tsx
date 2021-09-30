import React, { FC } from 'react';
import { IconPlus } from '@tabler/icons';
import { SideMenu } from '../../Framework/Toolbars';
import { SimVarControlElement } from './SimVarControlElement';
import { useProjectDispatch, useProjectSelector } from '../../../Store';
import { SimVarControl } from '../../../../../../shared/types/project/SimVarControl';
import { deleteControl } from '../../../Store/actions/simVarElements.actions';

export interface SimVarControlsMenuProps {
    onOpenNewControlMenu?: () => void,
    onStartEditingControl?: (control: SimVarControl) => void,
}

export const SimVarControlsMenu: FC<SimVarControlsMenuProps> = ({ onOpenNewControlMenu, onStartEditingControl }) => {
    const simVarControls = useProjectSelector((state) => state.simVarElements);
    const projectDispatch = useProjectDispatch();

    return (
        <SideMenu className="w-[420px] bg-navy z-50">
            <h2 className="mb-3 font-medium">SimVars</h2>

            <div className="flex flex-col divide-y divide-gray-700">
                {simVarControls.map((control) => (
                    <SimVarControlElement
                        key={control.__uuid}
                        simVarControl={control}
                        onEdit={() => onStartEditingControl(control)}
                        onDelete={() => projectDispatch(deleteControl(control))}
                    />
                ))}
            </div>

            <div
                className="flex flex-row justify-center items-center gap-x-2 py-3 mt-2 border-2 border-dashed text-gray-500 border-gray-500 rounded-md"
                onClick={onOpenNewControlMenu}
            >
                <IconPlus size={30} />

                <span className="text-xl">Add SimVar Control</span>
            </div>
        </SideMenu>
    );
};
