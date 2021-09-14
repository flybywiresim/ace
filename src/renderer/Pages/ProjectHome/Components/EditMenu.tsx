import { useEffect, useState } from "react";
import { useProject } from "../../../hooks/ProjectContext";
import { ProjectInstrumentsHandler } from "../../../Project/fs/Instruments";
import { useWorkspace } from "..";
import React from "react";

export const EditMenu = () => {
    const { project } = useProject();
    const { addInstrument } = useWorkspace();

    const [availableInstruments, setAvailableInstruments] = useState<string[]>([]);

    useEffect(() => {
        if (project) {
            setAvailableInstruments(ProjectInstrumentsHandler.loadAllInstruments(project).map((instrument) => instrument.config.name));
        } else {
            setAvailableInstruments([]);
        }
    }, [project]);

    return(
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
}