import React from 'react';
import { createDispatchHook, createSelectorHook } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { projectDataReducer } from './reducers/projectData.reducer';
import { simVarElementsReducer } from './reducers/simVarElements.reducer';
import { addControl, deleteControl, editControl } from './actions/simVarElements.actions';
import { SimVarControlsHandler } from '../../../Project/fs/SimVarControls';

const reducer = combineReducers({
    projectData: projectDataReducer,
    simVarElements: simVarElementsReducer,
});

const SIMVAR_CONTROL_SAVE_ACTIONS = [addControl.type, deleteControl.type, editControl.type];

export const store = configureStore({
    reducer,
    middleware: [
        (store) => (next) => (action) => {
            const ret = next(action);

            if (SIMVAR_CONTROL_SAVE_ACTIONS.includes(action.type)) {
                const state = store.getState();

                const simvarControlsHandler = new SimVarControlsHandler(state.projectData.data);

                simvarControlsHandler.saveConfig({
                    elements: state.simVarElements,
                });
            }

            return ret;
        },
    ],
});

export type ProjectState = ReturnType<typeof store.getState>;

export type ProjectDispatch = typeof store.dispatch;

export const ProjectStoreContext = React.createContext(null);

export const useProjectDispatch = createDispatchHook<ProjectState>(ProjectStoreContext);
export const useProjectSelector = createSelectorHook<ProjectState>(ProjectStoreContext);
