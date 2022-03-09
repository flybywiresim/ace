import { createAction } from '@reduxjs/toolkit';

export const setPersistentValue = createAction<[string, string]>('SET_PERSISTENT_VALUE');

export const deletePersistentValue = createAction<string>('DELETE_PERSISTENT_VALUE');
