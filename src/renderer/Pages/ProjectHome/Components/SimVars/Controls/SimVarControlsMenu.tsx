import React, { FC } from 'react';
import { v4 } from 'uuid';
import { IconPlus } from '@tabler/icons';
import { SideMenu } from '../../Framework/Toolbars';
import { SimVarControlElement } from './SimVarControlElement';
import { useProjectDispatch, useProjectSelector } from '../../../Store';
import { SimVarControl, SimVarControlStyleTypes } from '../../../../../../shared/types/project/SimVarControl';
import { deleteControl } from '../../../Store/actions/simVarElements.actions';
import { simVarDefinitionFromName } from '../../../../../../../ace-engine/src/SimVar';

export interface SimVarControlsMenuProps {
    onOpenNewControlMenu?: () => void,
    onStartEditingControl?: (control: SimVarControl) => void,
}

export const SimVarControlsMenu: FC<SimVarControlsMenuProps> = ({ onOpenNewControlMenu, onStartEditingControl }) => {
    const simVarControls = useProjectSelector((state) => state.simVarElements);
    const simVarValues = useProjectSelector((state) => state.simVarValues);
    const projectDispatch = useProjectDispatch();

    return (
        <SideMenu className="w-[480px] bg-navy z-50 overflow-auto">
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
                className="flex flex-row justify-center items-center gap-x-2 py-3 mt-2 border-2 border-dashed text-gray-500 border-gray-500 rounded-md cursor-pointer"
                onClick={onOpenNewControlMenu}
            >
                <IconPlus size={30} />

                <span className="text-xl">Add SimVar Control</span>
            </div>

            <div className="pt-5 mt-5 border-t-2 border-gray-700">
                <h3 className="mb-3 mt-0 mb-2.5 font-medium">Variables Used by Instruments</h3>

                {Object.entries(simVarValues).filter(([key]) => !simVarControls.some((it) => `${it.varPrefix}:${it.varName}` === key)).map((simVar) => (
                    <div className="flex justify-between mb-2">
                        <span className="text-xl text-gray-400 font-mono">{simVar[0]}</span>

                        <IconPlus
                            size={28}
                            className="text-gray-500 cursor-pointer hover:text-green-500"
                            onClick={() => {
                                // TODO units
                                const definition = simVarDefinitionFromName(simVar[0], 'number');

                                onStartEditingControl({
                                    __uuid: v4(),
                                    title: '',
                                    varPrefix: definition.prefix,
                                    varName: definition.name,
                                    varUnit: definition.unit,
                                    style: {
                                        type: SimVarControlStyleTypes.Number,
                                    },
                                });
                            }}
                        />
                    </div>
                ))}
            </div>
        </SideMenu>
    );
};
