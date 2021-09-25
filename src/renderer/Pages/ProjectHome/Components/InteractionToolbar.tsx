import React, { FC } from 'react';
import { IconArrowsMaximize, IconBulb, IconChevronLeft, IconPencil, IconRefresh, IconVariable } from '@tabler/icons';
import { Toolbar, ToolbarItem, ToolbarItemColors, ToolbarSeparator } from './Framework/Toolbars';
import { EditMenu } from './EditMenu';
import { useWorkspace } from '../WorkspaceContext';
import { LiveReloadMenu } from './LiveReloadMenu';
import { SimVarMenu } from './SimVars/SimVarMenu';

export const InteractionToolbar: FC = () => {
    const { inEditMode, setInEditMode } = useWorkspace();

    const handleSetEditMode = () => {
        setInEditMode((old) => !old);
    };

    return (
        <Toolbar>
            <ToolbarItem
                color={ToolbarItemColors.GREEN}
                renderPopover={() => (
                    <SimVarMenu />
                )}
            >
                <IconVariable size={56} strokeWidth={1.5} />
            </ToolbarItem>

            <ToolbarItem color={ToolbarItemColors.GREEN}>
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

            <ToolbarItem color={ToolbarItemColors.PURPLE} renderPopover={LiveReloadMenu}>
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
