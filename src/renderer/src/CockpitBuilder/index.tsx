import React, { FC, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

export const CockpitBuilder: FC = () => {
    const [cockpitElements, setCockpitElements] = useState<React.ReactNode[]>([]);

    // eslint-disable-next-line no-empty-pattern
    const [{ }, drop] = useDrop(() => ({
        accept: 'cockpitElement',
        drop: () => {
            setCockpitElements((cockpitElements) => [...cockpitElements, <PushButton label="ENG 2 BLEED" />]);
            return undefined;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
            didDrop: monitor.didDrop(),
        }),
    }));

    return (
        <main className="bg-panel flex h-screen" ref={drop}>
            <section className="bg-gray-600 w-32 flex flex-col justify-center">
                <PushButton label="ENG 2 BLEED" />
            </section>
            <div className="flex-grow flex justify-center ">
                <section className="grid grid-cols-12 grid-rows-12 gap-6 m-16">
                    {cockpitElements}
                </section>
            </div>
        </main>
    );
};

type PushbuttonColors = { upperColor: string, upperInactiveColor: string, lowerColor: string, lowerInactiveColor: string };

type PushButtonProps = { label: string, engaged?: boolean, upperActive?: boolean, upperText?: string, lowerText?: string, colors?: PushbuttonColors };

const PushButton: FC<PushButtonProps> = (
    {
        label, upperText = 'FAULT', lowerText = 'OFF', upperActive = true, colors = {
            upperColor: 'amber',
            upperInactiveColor: 'amber',
            lowerColor: 'white',
            lowerInactiveColor: 'gray-600',
        },
    },
) => {
    const [engaged, setEngaged] = useState(false);

    const [{ isDragging }, drag, dragPreview] = useDrag(
        () => ({
            type: 'cockpitElement',
            collect: (monitor) => ({ isDragging: monitor.isDragging() }),
        }),
    );

    return (
        <div
            className="text-white flex flex-col items-center"
            ref={dragPreview}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className="w-16 h-16 bg-black flex justify-center items-center rounded cursor-pointer select-none" ref={drag} onClick={() => (engaged ? setEngaged(false) : setEngaged(true))}>
                <div className="w-5/6 h-5/6 flex flex-col">
                    <div className={`flex-grow flex justify-center items-center text-${upperActive ? colors.upperColor : colors.upperInactiveColor}`}>{upperText}</div>
                    <div className={`h-2/5 flex justify-center items-center text-${engaged ? colors.lowerColor : colors.lowerInactiveColor} border-2 border-current`}>{lowerText}</div>
                </div>
            </div>
            <div className="text-sm mt-2">{label}</div>
        </div>
    );
};
