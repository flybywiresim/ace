import React, { FC, useRef, useState, useEffect } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Instrument } from './Instrument';
import { useProjectContext } from '../index';
import { PanelInstrument } from '../../../common/panel';

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

    const [airspeed, setAirspeed] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [heading, setHeading] = useState(0);
    const [roll, setRoll] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    useEffect(() => {
        window.localStorage.setItem('INDICATED ALTITUDE', JSON.stringify(altitude));
        window.localStorage.setItem('AIRSPEED INDICATED', JSON.stringify(airspeed));
        window.localStorage.setItem('PLANE HEADING DEGREES MAGNETIC', JSON.stringify(heading));
        window.localStorage.setItem('PLANE BANK DEGREES', JSON.stringify(roll));
        window.localStorage.setItem('PLANE PITCH DEGREES', JSON.stringify(pitch));
        window.localStorage.setItem('PLANE LATITUDE', JSON.stringify(latitude));
        window.localStorage.setItem('PLANE LONGITUDE', JSON.stringify(longitude));
    }, [airspeed, altitude, heading, roll, pitch, latitude, longitude]);
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
                <h1>Airspeed</h1>
                <input type="range" min="0" max="600" value={airspeed} onChange={(e) => setAirspeed(parseInt(e.target.value))} />
                <input type="number" value={airspeed} onChange={(e) => setAirspeed(parseInt(e.target.value))} />
                <h1>Altitude</h1>
                <input type="range" min="0" max="40000" value={altitude} onChange={(e) => setAltitude(parseInt(e.target.value))} />
                <input type="number" value={altitude} onChange={(e) => setAltitude(parseInt(e.target.value))} />
                <h1>Heading</h1>
                <input type="range" min="0" max="359" value={heading} onChange={(e) => setHeading(parseInt(e.target.value))} />
                <input type="number" value={heading} onChange={(e) => setHeading(parseInt(e.target.value))} />
                <h1>Roll</h1>
                <input type="range" min="-180" max="180" value={roll} onChange={(e) => setRoll(parseInt(e.target.value))} />
                <input type="number" value={roll} onChange={(e) => setRoll(parseInt(e.target.value))} />
                <h1>Pitch</h1>
                <input type="range" min="-180" max="180" value={pitch} onChange={(e) => setPitch(parseInt(e.target.value))} />
                <input type="number" value={pitch} onChange={(e) => setPitch(parseInt(e.target.value))} />
                <h1>Latitude</h1>
                <input type="number" value={latitude} onChange={(e) => setLatitude(parseFloat(e.target.value))} />
                <h1>Longitude</h1>
                <input type="number" value={longitude} onChange={(e) => setLongitude(parseFloat(e.target.value))} />
            </section>
            <section className="w-full h-full" ref={canvas}>
                <TransformWrapper
                    options={{ limitToBounds: false, minScale: 0 }}
                    onZoomChange={(a) => setZoomScale(a.scale)}
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
