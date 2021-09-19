import { createReducer } from '@reduxjs/toolkit';
import { popNotification, pushNotification } from '../actions/notifications.actions';

export const notificationsReducer = createReducer([], (builder) => {
    builder.addCase(pushNotification, (state, action) => {
        state.push(action.payload);
    });
    builder.addCase(popNotification, (state) => {
        state.shift();
    });
});
