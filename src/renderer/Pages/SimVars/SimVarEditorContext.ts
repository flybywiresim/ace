import React from 'react';

export interface SimVarEditorContextProps {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    unit: string;
    setUnit: React.Dispatch<React.SetStateAction<string>>;
    simVar: string;
    setSimVar: React.Dispatch<React.SetStateAction<string>>;
    type: string;
    setType: React.Dispatch<React.SetStateAction<string>>;
    min: number;
    setMin: React.Dispatch<React.SetStateAction<number>>;
    max: number;
    setMax: React.Dispatch<React.SetStateAction<number>>;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const SimVarEditorContext = React.createContext<SimVarEditorContextProps>({} as SimVarEditorContextProps);
