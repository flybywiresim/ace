import { createAction } from '@reduxjs/toolkit';
import { PossibleCanvasElements } from '../../../../../shared/types/project/canvas/CanvasSaveFile';

export const loadCanvasElements = createAction<PossibleCanvasElements[]>('LOAD_CANVAS_ELEMENTS');

export const addCanvasElement = createAction<PossibleCanvasElements>('ADD_CANVAS_ELEMENT');

export const updateCanvasElement = createAction<PossibleCanvasElements>('UPDATE_CANVAS_ELEMENT');

export const removeCanvasElement = createAction<string>('REMOVE_CANVAS_ELEMENT');
