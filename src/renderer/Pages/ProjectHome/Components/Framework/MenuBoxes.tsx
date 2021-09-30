import React, { FC } from 'react';
import { IconCircle, IconCircleCheck } from '@tabler/icons';

export interface SelectBoxProps {
    selectedItemIndex?: number,
    onItemSelected?: (item: number) => void,
}

export const SelectBox: FC<SelectBoxProps> = ({ selectedItemIndex = 0, onItemSelected = () => {}, children }) => {
    const handleItemSelected = (index: number) => onItemSelected(index);

    return (
        <div className="bg-navy-medium p-1 flex flex-col rounded-md shadow-inner">
            <div className="divide-y divide-navy rounded-md overflow-hidden">
                {React.Children.map(children, (child: React.ReactElement, index) => (
                    React.cloneElement(child, {
                        isSelected: index === selectedItemIndex,
                        onSelected: () => handleItemSelected(index),
                    })
                ))}
            </div>
        </div>
    );
};

export interface SelectBoxItemProps {
    inop?: boolean,
    inSelectBox?: boolean,
    isSelected?: boolean,
    onSelected?: () => void,
}

export const SelectBoxItem: FC<SelectBoxItemProps & React.HTMLAttributes<HTMLDivElement>> = (props) => (
    <div
        {...props}
        className={`flex items-center text-[1.225em] cursor-pointer ${props.inop ? 'opacity-60 pointer-events-none' : ''}`}
        onClick={props.onSelected}
    >
        {React.Children.map(props.children, (child: React.ReactElement) => (
            React.cloneElement(child, { isSelected: props.isSelected })
        ))}
    </div>
);

export interface SelectBoxItemIconProps {
    className?: string,
    isSelected?: boolean,
}

export const SelectBoxItemIcon: FC<SelectBoxItemIconProps> = ({ className = '', isSelected, children }) => (
    <div className={`self-stretch bg-green-500 ${isSelected ? 'bg-opacity-20' : 'bg-opacity-5 text-opacity-60'} text-green-500 px-3.5 py-3.5 ${className}`}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {React.Children.count(children) === 0 ? (
            isSelected ? (
                <IconCircleCheck />
            ) : (
                <IconCircle />
            )
        ) : (
            React.Children.map(children, ((child: React.ReactElement) => (
                React.cloneElement(child, { size: 25 })
            )))
        )}
    </div>
);

export const SelectBoxItemBody: FC = ({ children }) => (
    <span className={`w-full h-full flex
                      hover:bg-navy-lighter hover:bg-opacity-60
                      hover:text-green-500 justify-between items-center gap-x-3.5 pl-4 pr-2.5 py-3`}
    >
        {children}
    </span>
);
