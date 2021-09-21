import React, { memo } from 'react';

const GRID_LINE_SIZE = 10;

export const Grid = memo(() => {
    const lines = [];

    for (let i = 0; i < (10_000 / GRID_LINE_SIZE); i++) {
        lines.push(<line
            x1={0}
            y1={i * GRID_LINE_SIZE}
            x2={10000}
            y2={i * GRID_LINE_SIZE}
            stroke="#aaa"
            strokeWidth={0.05}
        />);
        lines.push(<line
            x1={i * GRID_LINE_SIZE}
            y1={0}
            x2={i * GRID_LINE_SIZE}
            y2={10000}
            stroke="#aaa"
            strokeWidth={0.05}
        />);
    }

    return (
        <svg className="absolute" viewBox="0 0 10000 10000" width="30000px" height="30000px">
            {lines}

            <line
                x1={0}
                y1={5000}
                x2={10000}
                y2={5000}
                stroke="#00c2cc"
                strokeWidth={0.15}
            />
            <line
                x1={5000}
                y1={0}
                x2={5000}
                y2={10000}
                stroke="#00c2cc"
                strokeWidth={0.15}
            />
        </svg>
    );
});
