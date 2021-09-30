import React, { FC, useEffect, useState } from 'react';
import {
    IconChevronRight,
    IconClick,
    IconCode,
    IconDashboard,
    IconMaximize, IconPlus,
    IconRectangle,
    IconResize,
    IconTrash,
} from '@tabler/icons';
import { ContextMenuProps, ContextMenu, ContextMenuItem, ContextMenuItemIcon, ContextMenuItemBody } from './Framework/ContextMenus';
import { PossibleCanvasElements } from '../../../../shared/types/project/canvas/CanvasSaveFile';
import { useWorkspace } from '../WorkspaceContext';
import { ProjectInstrumentsHandler } from '../../../Project/fs/Instruments';

export interface CanvasContextMenuProps extends ContextMenuProps {
    rightClickedElement?: PossibleCanvasElements,
}

export const CanvasContextMenu: FC<CanvasContextMenuProps> = ({ rightClickedElement, open, x, y }) => {
    const [instrumentsListOpen, setInstrumentsListOpen] = useState(false);

    const handleOpenInstrumentsList = () => setInstrumentsListOpen((open) => !open);

    useEffect(() => {
        if (!open) {
            setInstrumentsListOpen(false);
        }
    }, [open]);

    return (
        <>
            <ContextMenu open={open} x={x} y={y}>
                {rightClickedElement && (
                    <CanvasElementContextMenuSection rightClickedElement={rightClickedElement} />
                )}

                <div className="flex flex-col divide-y-[1px] divide-navy-lightest">
                    <ContextMenuItem onClick={handleOpenInstrumentsList}>
                        <ContextMenuItemIcon className="text-purple-400 bg-purple-400 bg-opacity-5">
                            <IconDashboard size={28} strokeWidth={1.25} />
                        </ContextMenuItemIcon>

                        <ContextMenuItemBody>
                            Add Instrument

                            <IconChevronRight opacity={0.8} />
                        </ContextMenuItemBody>
                    </ContextMenuItem>

                    <ContextMenuItem inop>
                        <ContextMenuItemIcon className="text-purple-400 bg-purple-400 bg-opacity-5">
                            <IconClick size={28} strokeWidth={1.25} />
                        </ContextMenuItemIcon>

                        <ContextMenuItemBody>
                            Add Cockpit Panel

                            <IconChevronRight opacity={0.8} />
                        </ContextMenuItemBody>
                    </ContextMenuItem>

                    <ContextMenuItem inop>
                        <ContextMenuItemIcon className="text-purple-400 bg-purple-400 bg-opacity-5">
                            <IconCode size={28} strokeWidth={1.25} />
                        </ContextMenuItemIcon>

                        <ContextMenuItemBody>
                            Add WASM Module

                            <IconChevronRight opacity={0.8} />
                        </ContextMenuItemBody>
                    </ContextMenuItem>
                </div>
            </ContextMenu>

            <CanvasContextMenuAddInstrumentSubmenu
                open={instrumentsListOpen}
                x={x + 294}
                y={y - 50}
            />
        </>
    );
};

// DecoratorConfigurationContextExceptionMessagePoolListenerDatabaseAuthenticationSchemaTaskServiceFacadeTagProducerSingleton
interface CanvasElementContextMenuSectionProps {
    rightClickedElement: PossibleCanvasElements,
}

const CanvasElementContextMenuSection: FC<CanvasElementContextMenuSectionProps> = ({ rightClickedElement }) => {
    const { removeCanvasElement } = useWorkspace();

    return (
        <>
            <h4 className="px-3.5 py-2 text-gray-300">{rightClickedElement.title}</h4>

            <div className="flex flex-col divide-y-[1px] divide-navy-lightest">
                <ContextMenuItem onClick={() => removeCanvasElement(rightClickedElement)}>
                    <ContextMenuItemIcon className="text-red-500 bg-red-500 bg-opacity-10">
                        <IconTrash size={32} strokeWidth={1.25} />
                    </ContextMenuItemIcon>

                    <span className="text-red-500">Delete</span>
                </ContextMenuItem>
            </div>

            <div className="flex flex-col divide-y-[1px] divide-navy-lightest">
                <ContextMenuItem inop>
                    <ContextMenuItemIcon className="bg-teal bg-opacity-5">
                        <IconMaximize size={32} strokeWidth={1.25} />
                    </ContextMenuItemIcon>

                    Fill Screen
                </ContextMenuItem>
                <ContextMenuItem inop>
                    <ContextMenuItemIcon className="bg-teal bg-opacity-5">
                        <IconResize size={32} strokeWidth={1.25} />
                    </ContextMenuItemIcon>

                    Resize
                </ContextMenuItem>
            </div>
        </>
    );
};

const CanvasContextMenuAddInstrumentSubmenu: FC<ContextMenuProps> = ({ open, x, y }) => {
    const { addInstrument, project } = useWorkspace();

    const [availableInstruments, setAvailableInstruments] = useState<string[]>([]);

    useEffect(() => {
        if (project) {
            setAvailableInstruments(ProjectInstrumentsHandler.loadAllInstruments(project).map((instrument) => instrument.config.name));
        } else {
            setAvailableInstruments([]);
        }
    }, [project]);

    const handleAddInstrument = (instrument: string) => {
        addInstrument(instrument);
    };

    return (
        <ContextMenu open={open} x={x} y={y}>
            {availableInstruments.map((instrument) => (
                <ContextMenuItem key={instrument} onClick={() => handleAddInstrument(instrument)}>
                    <ContextMenuItemIcon className="text-purple-400 bg-purple-400 bg-opacity-5">
                        <IconRectangle size={28} strokeWidth={1.25} />
                    </ContextMenuItemIcon>

                    <ContextMenuItemBody>
                        {instrument}

                        <IconPlus opacity={0.8} />
                    </ContextMenuItemBody>
                </ContextMenuItem>
            ))}
        </ContextMenu>
    );
};
