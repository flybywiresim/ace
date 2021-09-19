import { createAction } from '@reduxjs/toolkit';

export const pushNotification = createAction<string>('PUSH_NOTIFICATION');

export const popNotification = createAction('POP_NOTIFICATION');
