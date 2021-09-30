import React, { FC, useCallback, useState } from 'react';
import { SimVarControlsMenu } from './Controls/SimVarControlsMenu';
import { SimVarControlEditMenu } from './Controls/SimVarControlEditMenu';
import { SimVarControl } from '../../../../../shared/types/project/SimVarControl';

export const SimVarMenu: FC = () => {
    const [controlBeingEdited, setControlBeingEdited] = useState<SimVarControl>(null);
    const [newControlEditorOpen, setNewControlEditorOpen] = useState(false);

    const handleStartEditingControl = useCallback((control: SimVarControl) => {
        if (newControlEditorOpen) {
            return;
        }

        if (control === controlBeingEdited) {
            setControlBeingEdited(null);
        } else {
            setControlBeingEdited(control);
        }
    }, [controlBeingEdited, newControlEditorOpen]);

    return (
        <>
            <SimVarControlsMenu
                onOpenNewControlMenu={() => setNewControlEditorOpen(true)}
                onStartEditingControl={handleStartEditingControl}
            />

            {controlBeingEdited && (
                <SimVarControlEditMenu
                    control={controlBeingEdited}
                    onClose={() => setControlBeingEdited(null)}
                />
            )}

            {newControlEditorOpen && (
                <SimVarControlEditMenu
                    onClose={() => setNewControlEditorOpen(false)}
                />
            )}
        </>
    );
};
