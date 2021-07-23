import React, { FC, useRef, useState, useEffect } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Instrument } from './Instrument';
import { PanelInstrument } from '../../../common/panel';
import { useProjectContext } from '../Contexts/ProjectContext';
import { SimvarPanel } from './SimVars';

export type InstrumentDef = {
    name: string,
    path: string,
}

export type PanelElement = {
    index: number,
    contents: PanelInstrument,
}

export const Panel: FC = () => {
    const { loadedProject } = useProjectContext();

    if (!loadedProject) {
        return null;
    }

    const canvas = useRef<HTMLDivElement>();
    const [, setLastIndex] = useState(0);
    const [entries, setEntries] = useState<PanelElement[]>([]);
    const [zoomScale, setZoomScale] = useState(0);

    const handleAddElement = (instrument: PanelInstrument) => {
        setLastIndex((index) => {
            setEntries((instruments) => (
                [...instruments, { index, contents: instrument }]
            ));

            return index + 1;
        });
    };

    const handleRemoveElement = (index: number) => {
        setEntries((entries) => (
            entries.filter((e) => e.index !== index)
        ));
    };

    return (
        <main className="flex gap-x-4 bg-gray-100 p-4">
            <section>
                {loadedProject.panel.map((instrument) => (
                    <InstrumentCard
                        key={instrument.name}
                        instrument={instrument}
                        onSelected={() => handleAddElement(instrument)}
                    />
                ))}
                <SimvarPanel />
            </section>
            <section className="w-full h-full" ref={canvas}>
                <TransformWrapper
                    options={{ limitToBounds: false, minScale: 0 }}
                    onZoomChange={(a: any) => setZoomScale(a.scale)}
                >
                    <TransformComponent>
                        {entries.map((element) => (
                            <Instrument
                                key={`${element.contents.name}_${element.index}`}
                                instrument={element.contents}
                                index={element.index}
                                scale={zoomScale}
                                canvas={canvas}
                                onRemoved={() => handleRemoveElement(element.index)}
                            />
                        ))}
                    </TransformComponent>
                </TransformWrapper>
            </section>
        </main>
    );
};

export type InstrumentCardProps = {
    instrument: PanelInstrument,
    onSelected: () => void,
}

const InstrumentCard: FC<InstrumentCardProps> = ({ instrument: { name }, onSelected }) => (
    <div
        className="w-96 flex flex-col border border-gray-400 hover:bg-gray-200 px-5 py-3 mb-3 cursor-pointer"
        onClick={onSelected}
    >
        <span className="text-xl font-medium">{name}</span>
        {/* <span className="font-mono">{path}</span> */}
    </div>
);
