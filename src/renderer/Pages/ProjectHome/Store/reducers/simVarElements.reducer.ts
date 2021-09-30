import { createReducer } from '@reduxjs/toolkit';
import { addControl, deleteControl, editControl, loadControls } from '../actions/simVarElements.actions';
import { SimVarControl } from '../../../../../shared/types/project/SimVarControl';

export const simVarElementsReducer = createReducer<SimVarControl[]>([], (builder) => {
    builder.addCase(loadControls, (state, action) => {
        for (const control of action.payload) {
            if (!state.some((it) => it.__uuid === control.__uuid)) {
                state.push(control);
            }
        }
    });
    builder.addCase(addControl, (state, action) => {
        const control = action.payload;

        if (!state.some((it) => it.__uuid === control.__uuid)) {
            state.push(control);
        }
    });
    builder.addCase(deleteControl, (state, action) => {
        const control = action.payload;

        return state.filter((it) => it.__uuid !== control.__uuid);
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
