import { createReducer } from '@reduxjs/toolkit';
import { PossibleCanvasElements } from '../../../../../shared/types/project/canvas/CanvasSaveFile';
import {
    addCanvasElement,
    loadCanvasElements,
    removeCanvasElement,
    updateCanvasElement,
} from '../actions/canvas.actions';

export interface CanvasState {
    elements: PossibleCanvasElements[],
}

export const canvasReducer = createReducer<CanvasState>({ elements: [] }, (builder) => {
    builder.addCase(loadCanvasElements, (state, action) => {
        state.elements = [...action.payload];

        for (const element of state.elements) {
            if (element.__kind === 'instrument' && !element.dataKind) {
                element.dataKind = ('url' in element) ? 'web' : 'bundled';
            }
        }
    });

    builder.addCase(addCanvasElement, (state, action) => {
        if (state.elements.some((it) => it.__uuid === action.payload.__uuid)) {
            throw new Error('Cannot add element with existing UUID');
        }

        state.elements.push(action.payload);
    });

    builder.addCase(updateCanvasElement, (state, action) => {
        const editElement = state.elements.find((it) => it.__uuid === action.payload.__uuid);

        for (const key of Object.keys(action.payload)) {
            (editElement as any)[key] = (action.payload as any)[key];
        }
    });

    builder.addCase(removeCanvasElement, (state, action) => {
        state.elements = state.elements.filter((it) => it.__uuid !== action.payload);
    });
});
