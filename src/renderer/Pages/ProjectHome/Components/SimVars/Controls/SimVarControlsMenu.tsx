import React, { useState } from 'react';
import { IconPlus } from '@tabler/icons';
import { SideMenu } from '../../Framework/Toolbars';
import { SimVarControlElement } from './SimVarControlElement';
import { SimVarPresetsMenu } from '../Presets/SimVarPresetsMenu';
import { useWorkspace } from '../../../WorkspaceContext';
import { SimVarControl } from '../../../../../../shared/types/project/SimVarControl';

export const SimVarControlsMenu = () => {
    const { handlers: { simVarControls } } = useWorkspace();

    const [_newEditorShown, setNewEditorShown] = useState(false);

    const [simVarEditors, setSimVarEditors] = useState<SimVarControl[]>(() => simVarControls.loadConfig().elements);

    const handleControlEdit = (newControl: SimVarControl) => {
        simVarControls.updateObject(newControl);

        setSimVarEditors((old) => {
            const newArray = old.filter(({ __uuid }) => __uuid !== newControl.__uuid);

            newArray.push(newControl);

            return newArray;
        });
    };

    const _handleAddControl = (newControl: SimVarControl) => {
        simVarControls.addObject(newControl);

        setSimVarEditors((old) => {
            const newArray = old.filter(({ __uuid }) => __uuid !== newControl.__uuid);

            newArray.push(newControl);

            return newArray;
        });
    };

    return (
        <SideMenu className="w-[420px] bg-navy z-50">
            <h2 className="mb-3 font-medium">SimVars</h2>

            <div className="flex flex-col divide-y divide-gray-700">
                {simVarEditors.map((control) => (
                    <SimVarControlElement
                        key={control.__uuid}
                        simVarControl={control}
                        onEdit={handleControlEdit}
                    />
                ))}
            </div>

            <div
                className="flex flex-row justify-center items-center gap-x-2 py-3 mt-2 border-2 border-dashed text-gray-500 border-gray-500 rounded-md"
                onClick={() => setNewEditorShown(true)}
            >
                <IconPlus size={30} />

                <h3>Add SimVar Control</h3>
            </div>

            <div className="relative">
                {/* {newEditorShown && ( */}
                {/*    <SimVarControlEditor */}
                {/*        originalControl={{ */}
                {/*            __uuid: UUID(), */}
                {/*            title: 'Example Title', */}
                {/*            varPrefix: SimVarPrefix.A, */}
                {/*            varName: 'EXAMPLE SIMVAR', */}
                {/*            varUnit: 'number', */}
                {/*            style: { */}
                {/*                type: SimVarControlStyleTypes.RANGE, */}
                {/*                min: 0, */}
                {/*                max: 100, */}
                {/*                step: 1, */}
                {/*            }, */}
                {/*        }} */}
                {/*        onCancel={() => setNewEditorShown(false)} */}
                {/*        onSave={handleAddControl} */}
                {/*    /> */}
                {/* )} */}
            </div>

            <h2 className="mt-5 mb-5 font-medium">SimVar Presets</h2>

            <SimVarPresetsMenu />
        </SideMenu>
    );
};
