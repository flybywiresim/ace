import React from 'react';
import { createDispatchHook, createSelectorHook } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { projectDataReducer } from './reducers/projectData.reducer';
import { simVarElementsReducer } from './reducers/simVarElements.reducer';
import { addControl, deleteControl, editControl } from './actions/simVarElements.actions';
import { SimVarControlsHandler } from '../../../Project/fs/SimVarControls';
import { simVarValuesReducer } from './reducers/simVarValues.reducer';
import { persistentStorageReducer } from './reducers/persistentStorage.reducer';
import { PersistentStorageHandler } from '../../../Project/fs/PersistentStorageHandler';
import { deletePersistentValue, setPersistentValue } from './actions/persistentStorage.actions';

const reducer = combineReducers({
    projectData: projectDataReducer,
    simVarValues: simVarValuesReducer,
    persistentStorage: persistentStorageReducer,
    simVarElements: simVarElementsReducer,
});

const SIMVAR_CONTROL_SAVE_ACTIONS = [addControl.type, deleteControl.type, editControl.type];

const PERSISTENT_STORAGE_SAVE_ACTIONS = [setPersistentValue.type, deletePersistentValue.type];

export const projectStore = configureStore({
    reducer,
    middleware: [
        (store) => (next) => (action) => {
            const ret = next(action);

            const state = store.getState();

            if (SIMVAR_CONTROL_SAVE_ACTIONS.includes(action.type)) {
                handleSaveSimVarControlState(state);
            }

            if (PERSISTENT_STORAGE_SAVE_ACTIONS.includes(action.type)) {
                handleSavePersistentStorageState(state);
            }

            return ret;
        },
    ],
});

function handleSaveSimVarControlState(state: ProjectState) {
    const simvarControlsHandler = new SimVarControlsHandler(state.projectData.data);

    simvarControlsHandler.saveConfig({
        elements: state.simVarElements,
    });
}

function handleSavePersistentStorageState(state: ProjectState) {
    const persistentStorageHandler = new PersistentStorageHandler(state.projectData.data.location);

    persistentStorageHandler.saveConfig({
        data: state.persistentStorage,
    });
}

export type ProjectState = ReturnType<typeof projectStore.getState>;

export type ProjectDispatch = typeof projectStore.dispatch;

export const ProjectStoreContext = React.createContext(null);

export const useProjectDispatch = createDispatchHook<ProjectState>(ProjectStoreContext);
export const useProjectSelector = createSelectorHook<ProjectState>(ProjectStoreContext);
