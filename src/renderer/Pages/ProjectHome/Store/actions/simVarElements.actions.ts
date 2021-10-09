import { createAction } from '@reduxjs/toolkit';
import { SimVarControl } from '../../../../../shared/types/project/SimVarControl';

export const loadControls = createAction<SimVarControl[]>('LOAD_CONTROLS');

export const addControl = createAction<SimVarControl>('ADD_CONTROL');

export const editControl = createAction<SimVarControl>('EDIT_CONTROL');
