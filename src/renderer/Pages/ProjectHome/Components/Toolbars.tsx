import React, { FC } from 'react';

export const Toolbar: FC = ({ children }) => (
    <div className="flex flex-col gap-y-3">
        {children}
    </div>
);

export enum ToolbarItemColors {
    TEAL = 'hover:border-teal hover:text-teal',
    RED = 'hover:border-red-500 hover:text-red-500',
    PURPLE = 'hover:border-purple-500 hover:text-purple-500',
    GREEN = 'hover:border-green-500 hover:text-green-500',
    TRANSLUCENT = 'bg-opacity-20 border-opacity-20 hover:border-navy-lightest hover:text-teal'
}

export interface ToolbarItemProps {
    onClick?: () => void;
    color?: ToolbarItemColors;
    renderPopover?: FC;
    visible?: boolean;
}

export const ToolbarItem: FC<ToolbarItemProps> = ({ onClick, color = ToolbarItemColors.TEAL, renderPopover: RenderPopover, visible = false, children }) => (
    <>
        <span
            className={'w-14 h-14 '
                + `bg-navy-lighter hover:bg-navy-lightest border border-gray-500 hover:border-2 ${color} transition-all duration-200 cursor-pointer `
                + 'p-3 flex flex-row justify-center items-center rounded-md shadow-lg hover:shadow-xl'}
            onClick={onClick}
        >
            {children}
        </span>

        {visible && (
            <div className="absolute left-28 top-5 bg-navy px-4 py-2.5">
                <RenderPopover />
            </div>
        )}
    </>
);


export const ToolbarSeparator: FC = () => (
    <span className="w-[48px] h-[1.5px] ml-1 my-0.5 bg-navy-lightest" />
);
