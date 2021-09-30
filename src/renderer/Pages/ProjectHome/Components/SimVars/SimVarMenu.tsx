import React, { FC } from 'react';
import { SimVarControlsMenu } from './Controls/SimVarControlsMenu';
import { SimVarControlEditMenu } from './Controls/SimVarControlEditMenu';

export const SimVarMenu: FC = () => (
    <>
        <SimVarControlsMenu />

        <SimVarControlEditMenu />
    </>
);
