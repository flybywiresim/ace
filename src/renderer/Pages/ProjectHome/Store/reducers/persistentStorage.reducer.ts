import { createReducer } from '@reduxjs/toolkit';
import { deletePersistentValue, setPersistentValue } from '../actions/persistentStorage.actions';
import { reset } from '../actions/global.actions';

export const persistentStorageReducer = createReducer<Record<string, string>>({}, (builder) => {
    builder.addCase(reset, (state) => {
        for (const key of Object.getOwnPropertyNames(state)) {
            delete state[key];
        }
    });

    builder.addCase(setPersistentValue, ((state, action) => {
        const [key, value] = action.payload;

        state[key] = value;
    }));

    builder.addCase(deletePersistentValue, (state, action) => {
        delete state[action.payload];
    });
});
