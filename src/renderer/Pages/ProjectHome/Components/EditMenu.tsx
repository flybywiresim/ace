import React, { useEffect, useState } from 'react';
import { useWorkspace } from '../WorkspaceContext';
import { ProjectInstrumentsHandler } from '../../../Project/fs/Instruments';
import { SideMenu } from './Framework/Toolbars';

export const EditMenu = () => {
    const { addInstrument, project } = useWorkspace();

    const [availableInstruments, setAvailableInstruments] = useState<string[]>([]);

    useEffect(() => {
        if (project) {
            setAvailableInstruments(ProjectInstrumentsHandler.loadAllInstruments(project).map((instrument) => instrument.config.name));
        } else {
            setAvailableInstruments([]);
        }
    }, [project]);

    return (
        <SideMenu className="w-[480px] bg-navy z-50 overflow-auto">
            <h2 className="mb-3 font-medium">Edit</h2>

            <h3 className="mb-3 font-small">Add Instrument</h3>
            {availableInstruments.map((instrument) => (
                <button
                    type="button"
                    onClick={() => {
                        addInstrument(instrument);
                    }}
                >
                    {instrument}
                </button>
            ))}
        </SideMenu>
    );
};
