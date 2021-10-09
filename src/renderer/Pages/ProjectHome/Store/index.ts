import React from 'react';
import { createDispatchHook, createSelectorHook } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { simVarElementsReducer } from './reducers/simVarElements.reducer';
import { addControl, editControl } from './actions/simVarElements.actions';

const reducer = combineReducers({
    simVarElements: simVarElementsReducer,
});

export const store = configureStore({
    reducer,
    middleware: [
        (_store) => (next) => (action) => {
            if (action.type === addControl.type) {
                console.log('BRUH');
            } else if (action.type === editControl.type) {
                console.log('BRUH');
            }

            return next(action);
        },
    ],
});

export type ProjectState = ReturnType<typeof store.getState>;

export type ProjectDispatch = typeof store.dispatch;

export const ProjectStoreContext = React.createContext(null);

export const useProjectDispatch = createDispatchHook<ProjectState>(ProjectStoreContext);
export const useProjectSelector = createSelectorHook<ProjectState>(ProjectStoreContext);
