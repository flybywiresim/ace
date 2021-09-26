import React, { FC } from 'react';

export interface ContextMenuProps {
    open: boolean,
    x: number,
    y: number,
}

export const ContextMenu: FC<ContextMenuProps> = ({ open, x, y, children }) => {
    const handleClick = (e: React.MouseEvent) => e.stopPropagation();

    return (
        <div
            className={`min-w-[260px] absolute bg-navy-lighter border-opacity-50 rounded-md shadow-md z-50 overflow-hidden divide-y-2 divide-gray-700 ${!open && 'invisible'}`}
            style={{ left: `${x}px`, top: `${y}px` }}
            onMouseDown={handleClick}
        >
            {children}
        </div>
    );
};

export interface ContextMenuItemProps {
    inop?: boolean,
}

export const ContextMenuItem: FC<ContextMenuItemProps & React.HTMLAttributes<HTMLDivElement>> = (props) => (
    <div
        {...props}
        className={`flex items-center gap-x-4 text-[1.225em] cursor-pointer hover:bg-navy-light hover:text-teal ${props.inop ? 'opacity-60 pointer-events-none' : ''}`}
    >
        {props.children}
    </div>
);

export interface ContextMenuItemIconProps {
    className?: string,
}

export const ContextMenuItemIcon: FC<ContextMenuItemIconProps> = ({ children, className = '' }) => (
    <div className={`self-stretch bg-navy-light text-teal px-3.5 py-3.5 ${className}`}>
        {React.Children.map(children, ((child: React.ReactElement) => (
            React.cloneElement(child, { size: 25 })
        )))}
    </div>
);

export const ContextMenuItemBody: FC = ({ children }) => (
    <span className="w-full flex justify-between items-center gap-x-3.5 pr-2.5">
        {children}
    </span>
);
