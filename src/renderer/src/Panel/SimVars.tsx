import React, { useEffect, useState } from 'react';

export const SimvarPanel = () => {
    const [airspeed, setAirspeed] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [heading, setHeading] = useState(0);
    const [roll, setRoll] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

    const [extraVars, setExtraVars] = useState([]);

    const [newVarName, setNewVarName] = useState('');
    const [newVarIdentifier, setNewVarIdentifier] = useState('');

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
        <>
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
            {extraVars.map((item, index) => (
                <>
                    <h1>{item.name}</h1>
                    <input
                        type="text"
                        onChange={(e) => window.localStorage.setItem(item.varIdentifier, JSON.stringify(parseFloat(e.target.value)))}
                    />
                    <button
                        type="button"
                        onClick={() => setExtraVars((a) => a.filter((_, i) => i !== index))}
                    >
                        Remove
                    </button>
                </>
            ))}
            <br />
            <br />
            <input type="text" placeholder="Name" value={newVarName} onChange={(e) => setNewVarName(e.target.value)} />
            <input type="text" placeholder="SimVar Identifier" value={newVarIdentifier} onChange={(e) => setNewVarIdentifier(e.target.value)} />
            <button type="button" onClick={() => setExtraVars((a) => [...a, { name: newVarName, varIdentifier: newVarIdentifier }])}>Add</button>
        </>
    );
};
