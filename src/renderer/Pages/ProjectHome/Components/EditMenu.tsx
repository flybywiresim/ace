import React, { useEffect, useState } from 'react';
import { useWorkspace } from '..';
import { ProjectInstrumentsHandler } from '../../../Project/fs/Instruments';

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
        <div className="relative">
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
        </div>
    );
};
