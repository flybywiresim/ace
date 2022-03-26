import { createReducer } from '@reduxjs/toolkit';
import { setInteractionMode } from '../actions/interaction.actions';

export const interactionReducer = createReducer<{ inInteractionMode: boolean }>({ inInteractionMode: false }, (builder) => {
    builder.addCase(setInteractionMode, (state, action) => {
        state.inInteractionMode = action.payload;
    });
});
