import React, { FC, useState } from 'react';
import { v4 as UUID } from 'uuid';
import { useWorkspace } from '../../WorkspaceContext';
import { SimVarControl, SimVarControlStyleTypes } from '../../../../../shared/types/project/SimVarControl';
import { SimVarControlElement } from './SimVarControlElement';
import { SimVarControlEditor } from './SimVarControlEditor';
import { SimVarPrefix } from '../../../../../shared/types/SimVar';

export const SimVarMenu: FC = () => {
    const { handlers: { simVarControls } } = useWorkspace();

    const [newEditorShown, setNewEditorShown] = useState(false);

    const [simVarEditors, setSimVarEditors] = useState<SimVarControl[]>(() => simVarControls.loadConfig().elements);

    const handleControlEdit = (newControl: SimVarControl) => {
        simVarControls.updateObject(newControl);

        setSimVarEditors((old) => {
            const newArray = old.filter(({ __uuid }) => __uuid !== newControl.__uuid);

            newArray.push(newControl);

            return newArray;
        });
    };

    const handleAddControl = (newControl: SimVarControl) => {
        simVarControls.addObject(newControl);

        setSimVarEditors((old) => {
            const newArray = old.filter(({ __uuid }) => __uuid !== newControl.__uuid);

            newArray.push(newControl);

            return newArray;
        });
    };

    return (
        <section className="w-[420px]">
            <h2 className="mb-3 font-medium">SimVars</h2>

            {simVarEditors.map((control) => (
                <SimVarControlElement
                    key={control.__uuid}
                    simVarControl={control}
                    onEdit={handleControlEdit}
                />
            ))}

            <div className="relative">
                <button
                    type="button"
                    className="w-full mt-3"
                    onClick={() => setNewEditorShown(true)}
                >
                    Add SimVars
                </button>

                {newEditorShown && (
                    <SimVarControlEditor
                        originalControl={{
                            __uuid: UUID(),
                            title: 'Example Title',
                            varPrefix: SimVarPrefix.A,
                            varName: 'EXAMPLE SIMVAR',
                            varUnit: 'number',
                            style: {
                                type: SimVarControlStyleTypes.RANGE,
                                min: 0,
                                max: 100,
                                step: 1,
                            },
                        }}
                        onCancel={() => setNewEditorShown(false)}
                        onSave={handleAddControl}
                    />
                )}
            </div>
        </section>
    );
};
