import React from 'react';

const GRID_LINE_SIZE = 100;

export const Grid = () => (
    <svg className="absolute" viewBox="0 0 1000 1000" width="30000px" height="30000px">
        <defs>
            <pattern id="vlines" width={`${(GRID_LINE_SIZE / 100000) * 100}%`} height="100%">
                {/* <circle cx={0} cy={0} r={5} fill="red" /> */}
                <line x1={0} y1={0} x2={0} y2="100%" stroke="#ddd" strokeWidth=".001vw" />
            </pattern>
            <pattern id="hlines" width="100%" height={`${(GRID_LINE_SIZE / 100000) * 100}%`}>
                {/* <circle cx={0} cy={0} r={5} fill="red" /> */}
                <line x1={0} y1={0} x2="100%" y2={0} stroke="#ddd" strokeWidth=".001vw" />
            </pattern>
        </defs>

        <rect x={0} y={0} width="100%" height="100%" fill="url(#vlines)" />
        <rect x={0} y={0} width="100%" height="100%" fill="url(#hlines)" />
    </svg>
);
