import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

export const Toolbar: FC = ({ children }) => (
    <div className="flex flex-col gap-y-3">
        {children}
    </div>
);

interface ToolbarItemColor {
    normal: string;
    active: string;
}

export const ToolbarItemColors: { [k: string]: ToolbarItemColor } = {
    TEAL: {
        normal: 'hover:border-2 hover:border-teal hover:text-teal',
        active: 'border-2 border-teal text-teal',
    },
    RED: {
        normal: 'hover:border-2 hover:border-red-500 hover:text-red-500',
        active: 'border-2 border-red-500 text-red-500',
    },
    PURPLE: {
        normal: 'hover:border-2 hover:border-purple-500 hover:text-purple-500',
        active: 'border-2 border-purple-500 text-purple-500',
    },
    GREEN: {
        normal: 'hover:border-2 hover:border-green-500 hover:text-green-500',
        active: 'border-2 border-green-500 text-green-500',
    },
    TRANSLUCENT: {
        normal: 'bg-opacity-20 border-opacity-20 hover:border-2 hover:border-navy-lightest hover:text-teal',
        active: 'bg-opacity-20 border-opacity-20 border-2 border-navy-lightest text-teal',
    },
};

export interface ToolbarItemProps {
    onClick?: () => void;
    onToggle?: (open :boolean) => void;
    color?: ToolbarItemColor;
    renderPopover?: FC;
    visible?: boolean;
}

export const ToolbarItem: FC<ToolbarItemProps> = ({ onClick, onToggle, color = ToolbarItemColors.TEAL, renderPopover: RenderPopover, visible = undefined, children }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);

    const buttonRef = useRef<HTMLSpanElement>(null);
    const buttonRect = useRef<DOMRect>(null);

    useEffect(() => {
        if (buttonRef.current) {
            buttonRect.current = buttonRef.current.getBoundingClientRect();
        }
    }, [buttonRef]);

    useEffect(() => {
        onToggle?.(popoverOpen);
    }, [onToggle, popoverOpen]);

    const buttonClassName = useCallback(() => {
        if (popoverOpen || visible) {
            return 'w-14 h-14 '
                + `bg-navy-lighter hover:bg-navy-lightest border ${color.active} transition-all duration-150 cursor-pointer `
                + 'p-3 flex flex-row justify-center items-center rounded-md shadow-lg hover:shadow-xl';
        }
        return 'w-14 h-14 '
                + `bg-navy-lighter hover:bg-navy-lightest border border-gray-500 ${color.normal} transition-all duration-150 cursor-pointer `
                + 'p-3 flex flex-row justify-center items-center rounded-md shadow-lg hover:shadow-xl';
    }, [color, popoverOpen, visible]);

    const handleClick = () => {
        onClick?.();

        if (visible === undefined) {
            setPopoverOpen((old) => !old);
        }
    };

    return (
        <>
            <span
                ref={buttonRef}
                className={buttonClassName()}
                onClick={handleClick}
            >
                {children}
            </span>

            {(popoverOpen || visible) && RenderPopover && (
                <div className="absolute left-28 bg-navy px-4 py-2.5 rounded-md" style={{ top: `${buttonRect.current.y - buttonRect.current.height + 4}px` }}>
                    <RenderPopover />
                </div>
            )}
        </>
    );
};

export const ToolbarSeparator: FC = () => (
    <span className="w-[48px] h-[1.5px] ml-1 my-0.5 bg-navy-lightest" />
);
