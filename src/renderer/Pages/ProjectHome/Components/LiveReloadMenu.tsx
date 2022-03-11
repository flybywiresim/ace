import React, { FC, useEffect, useState } from 'react';
import { LiveReloadConfig } from '../../../../shared/types/project/LiveReloadConfig';
import { useWorkspace } from '../WorkspaceContext';
import { SideMenu } from './Framework/Toolbars';

export const LiveReloadMenu: FC = () => {
    const { project, handlers, startLiveReload } = useWorkspace();
    const [liveReloadConfig, setLiveReloadConfig] = useState<LiveReloadConfig>(null);

    useEffect(() => {
        setLiveReloadConfig(handlers.liveReload.loadConfig());
    }, [handlers.liveReload, project]);

    const handleStartLiveReload = () => {
        startLiveReload();
    };

    return (
        <SideMenu className="w-[480px] bg-navy z-50 overflow-auto">
            <h2 className="mb-3 font-medium">Live Reload</h2>

            {liveReloadConfig && (
                <pre>
                    {JSON.stringify(liveReloadConfig, null, 4)}
                </pre>
            )}

            {(!liveReloadConfig) && (
                <SetLiveReloadConfig creation />
            )}

            <button type="button" onClick={handleStartLiveReload}>Start live reload</button>
        </SideMenu>
    );
};

interface SetLiveReloadConfigProps {
    creation: boolean,
}

const SetLiveReloadConfig: FC<SetLiveReloadConfigProps> = ({ creation }) => (
    <>
        {creation && (
            <p>You do not have a live reload config yet. Configure it below.</p>
        )}
    </>
);
