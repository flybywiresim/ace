import { createReducer } from '@reduxjs/toolkit';
import { addControl, editControl, loadControls } from '../actions/simVarElements.actions';
import { SimVarControl } from '../../../../../shared/types/project/SimVarControl';

export const simVarElementsReducer = createReducer<SimVarControl[]>([], (builder) => {
    builder.addCase(loadControls, (state, action) => {
        state.push(...action.payload);
    });
    builder.addCase(addControl, (state, action) => {
        state.push(action.payload);
    });
    builder.addCase(editControl, (state, action) => {
        const control = state.find((el) => el.__uuid === action.payload.__uuid);

        for (const key in control) {
            if (key in action.payload && key !== '__uuid') {
                (control as any)[key] = (action.payload as any)[key];
            }
        }
    });
});
