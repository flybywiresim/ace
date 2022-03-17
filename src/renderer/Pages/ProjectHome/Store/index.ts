import React from 'react';
import { createDispatchHook, createSelectorHook } from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { projectDataReducer } from './reducers/projectData.reducer';
import { simVarElementsReducer } from './reducers/simVarElements.reducer';
import { addControl, deleteControl, editControl } from './actions/simVarElements.actions';
import { SimVarControlsHandler } from '../../../Project/fs/SimVarControls';
import { simVarValuesReducer } from './reducers/simVarValues.reducer';
import { persistentStorageReducer } from './reducers/persistentStorage.reducer';
import { deletePersistentValue, setPersistentValue } from './actions/persistentStorage.actions';
import { setSimVarValue } from './actions/simVarValues.actions';
import { timelineReducer } from './reducers/timeline.reducer';
import { interactionToolbarReducer } from './reducers/interactionToolbar.reducer';
import { coherentReducer } from './reducers/coherent.reducer';
import { canvasReducer } from './reducers/canvas.reducer';
import { QueuedDataWriter } from '../QueuedDataWriter';
import { addCanvasElement, removeCanvasElement, updateCanvasElement } from './actions/canvas.actions';
import { interactionReducer } from './reducers/interaction.reducer';

const reducer = combineReducers({
    projectData: projectDataReducer,
    canvas: canvasReducer,
    simVarValues: simVarValuesReducer,
    interaction: interactionReducer,
    persistentStorage: persistentStorageReducer,
    simVarElements: simVarElementsReducer,
    timeline: timelineReducer,
    interactionToolbar: interactionToolbarReducer,
    coherent: coherentReducer,
});

const CANVAS_SAVE_ACTIONS = [addCanvasElement.type, removeCanvasElement.type, updateCanvasElement.type];

const SIMVAR_CONTROL_SAVE_ACTIONS = [addControl.type, deleteControl.type, editControl.type];

const SIMVAR_VALUES_SAVE_ACTIONS = [setSimVarValue.type];

const PERSISTENT_STORAGE_SAVE_ACTIONS = [setPersistentValue.type, deletePersistentValue.type];

export const projectStore = configureStore({
    reducer,
    middleware: [
        (store) => (next) => (action) => {
            const ret = next(action);

            const state = store.getState();

            if (CANVAS_SAVE_ACTIONS.includes(action.type)) {
                QueuedDataWriter.enqueueCanvasWrite();
            }

            if (SIMVAR_CONTROL_SAVE_ACTIONS.includes(action.type)) {
                handleSaveSimVarControlState(state);
            }

            if (SIMVAR_VALUES_SAVE_ACTIONS.includes(action.type)) {
                QueuedDataWriter.enqueueSimVarValuesWrite();
            }

            if (PERSISTENT_STORAGE_SAVE_ACTIONS.includes(action.type)) {
                QueuedDataWriter.enqueuePersistentDataWrite();
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

export type ProjectState = ReturnType<typeof projectStore.getState>;

export type ProjectDispatch = typeof projectStore.dispatch;

export const ProjectStoreContext = React.createContext(null);

export const useProjectDispatch = createDispatchHook<ProjectState>(ProjectStoreContext);
export const useProjectSelector = createSelectorHook<ProjectState>(ProjectStoreContext);
