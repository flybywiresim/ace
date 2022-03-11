import React, { FC } from 'react';
import { IconArrowsMaximize, IconBulb, IconChevronLeft, IconPencil, IconRefresh, IconVariable } from '@tabler/icons';
import { Toolbar, ToolbarItem, ToolbarItemColors, ToolbarSeparator } from './Framework/Toolbars';
import { EditMenu } from './EditMenu';
import { useWorkspace } from '../WorkspaceContext';
import { useProjectDispatch, useProjectSelector } from '../Store';
import { WorkspacePanelSelection } from '../Store/reducers/interactionToolbar.reducer';
import { selectWorkspacePanel } from '../Store/actions/interactionToolbar.actions';

export const InteractionToolbar: FC = () => {
    const { inEditMode, setInEditMode } = useWorkspace();

    const handleSetEditMode = () => {
        setInEditMode((old) => !old);
    };

    const panelSelection = useProjectSelector((state) => state.interactionToolbar.panel);
    const dispatch = useProjectDispatch();

    const selectPanel = (panel: WorkspacePanelSelection) => {
        if (panel === panelSelection) {
            dispatch(selectWorkspacePanel(WorkspacePanelSelection.None));
        } else {
            dispatch(selectWorkspacePanel(panel));
        }
    };

    return (
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

            <ToolbarSeparator />

            <ToolbarItem
                visible={inEditMode}
                onClick={handleSetEditMode}
                color={ToolbarItemColors.PURPLE}
                renderPopover={() => (
                    <EditMenu />
                )}
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
    );
};
