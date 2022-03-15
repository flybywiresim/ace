import React, { FC } from 'react';
import {
    IconArrowsMaximize,
    IconBell,
    IconBulb,
    IconChevronLeft,
    IconPencil,
    IconRefresh,
    IconVariable,
} from '@tabler/icons';
import { Toolbar, ToolbarItem, ToolbarItemColors, ToolbarSeparator } from './Framework/Toolbars';
import { useProjectDispatch, useProjectSelector } from '../Store';
import { WorkspacePanelSelection } from '../Store/reducers/interactionToolbar.reducer';
import { selectWorkspacePanel } from '../Store/actions/interactionToolbar.actions';
import { SimVarMenu } from './SimVars/SimVarMenu';
import { Timeline } from './Timeline';
import { LiveReloadMenu } from './LiveReloadMenu';
import { CoherentMenu } from './CoherentMenu';

export const InteractionToolbar: FC = () => {
    const panelSelection = useProjectSelector((state) => state.interactionToolbar.panel);
    const dispatch = useProjectDispatch();

    const selectPanel = (panel: WorkspacePanelSelection) => {
        if (panel === panelSelection) {
            dispatch(selectWorkspacePanel(WorkspacePanelSelection.None));
        } else {
            dispatch(selectWorkspacePanel(panel));
        }
    };

    const currentPanel = useProjectSelector((state) => state.interactionToolbar.panel);

    const getCurrentPanel = () => {
        switch (currentPanel) {
        default:
            return <></>;
        case WorkspacePanelSelection.SimVars:
            return <SimVarMenu />;
        case WorkspacePanelSelection.Timeline:
            return <Timeline />;
        case WorkspacePanelSelection.Coherent:
            return <CoherentMenu />;
        case WorkspacePanelSelection.LiveReload:
            return <LiveReloadMenu />;
        }
    };

    return (
        <>
            <Toolbar>
                <ToolbarItem
                    color={ToolbarItemColors.GREEN}
                    visible={panelSelection === WorkspacePanelSelection.SimVars}
                    onClick={() => selectPanel(WorkspacePanelSelection.SimVars)}
                >
                    <IconVariable size={56} strokeWidth={1.5} />
                </ToolbarItem>

                <ToolbarItem
                    color={ToolbarItemColors.GREEN}
                    visible={panelSelection === WorkspacePanelSelection.Timeline}
                    onClick={() => selectPanel(WorkspacePanelSelection.Timeline)}
                >
                    <IconBulb size={56} strokeWidth={1.5} />
                </ToolbarItem>

                <ToolbarItem
                    color={ToolbarItemColors.GREEN}
                    visible={panelSelection === WorkspacePanelSelection.Coherent}
                    onClick={() => selectPanel(WorkspacePanelSelection.Coherent)}
                >
                    <IconBell size={56} strokeWidth={1.5} />
                </ToolbarItem>

                <ToolbarSeparator />

                <ToolbarItem
                    visible={panelSelection === WorkspacePanelSelection.Edit}
                    onClick={() => selectPanel(WorkspacePanelSelection.Edit)}
                    color={ToolbarItemColors.PURPLE}
                >
                    <IconPencil size={56} strokeWidth={1.5} />
                </ToolbarItem>

                <ToolbarItem
                    color={ToolbarItemColors.PURPLE}
                    visible={panelSelection === WorkspacePanelSelection.LiveReload}
                    onClick={() => selectPanel(WorkspacePanelSelection.LiveReload)}
                >
                    <IconRefresh size={56} strokeWidth={1.5} />
                </ToolbarItem>

                <ToolbarSeparator />

                <ToolbarItem color={ToolbarItemColors.GREEN}>
                    <IconArrowsMaximize size={56} strokeWidth={1.5} />
                </ToolbarItem>

                <ToolbarItem color={ToolbarItemColors.TRANSLUCENT}>
                    <IconChevronLeft size={48} strokeWidth={1.25} />
                </ToolbarItem>
            </Toolbar>
            <div className="absolute min-w-max h-full left-28 flex" style={{ top: 0 }}>
                {getCurrentPanel()}
            </div>
        </>

    );
};
