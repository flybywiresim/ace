import React, { FC, FocusEvent, useCallback, useEffect, useRef, useState } from 'react';
import { SimVarControlEditor } from './SimVarControlEditor';
import { SimVarControl, SimVarControlStyle, SimVarControlStyleTypes } from '../../../../../shared/types/project/SimVarControl';

export type SimVarEditorProps = {
    name: string;
    unit?: string;
    simVar: string;
    initialState?: any;
    style: SimVarControlStyle;
    max?: number;
    min?: number;
    step?: number;
};

interface SimVarEditorProps2 {
    simVarControl: SimVarControl,
    onEdit: (newControl: SimVarControl) => void,
}

export const SimVarControlElement: React.FC<SimVarEditorProps2> = ({ simVarControl, onEdit }) => {
    const valueRef = useRef<HTMLSpanElement>();

    const normalizeTextValue = (state: string) => {
        const parsedFloat = parseFloat(state);

        if (Number.isNaN(parsedFloat)) {
            return state;
        }

        return parsedFloat;
    };

    const [state, handleSetState] = useState<any>(() => {
        const rawValue = window.localStorage.getItem(simVarControl.varName);

        return normalizeTextValue(rawValue);
    });

    useEffect(() => {
        const normalizedValue = normalizeTextValue(state);

        window.localStorage.setItem(simVarControl.varName, String(normalizedValue));

        if (valueRef.current && document.activeElement !== valueRef.current) {
            valueRef.current.innerText = state;
        }
    }, [simVarControl.varName, state]);

    const [editorShown, setEditorShown] = useState(false);

    return (
        <div className="relative">
            <div className="flex flex-col justify-start gap-y-1">
                <h1 className="text-lg font-medium">{simVarControl.title}</h1>

                <div className="flex flex-row items-center gap-x-3">
                    {(simVarControl.style.type === SimVarControlStyleTypes.TEXT_INPUT
                        || simVarControl.style.type === SimVarControlStyleTypes.NUMBER
                        || simVarControl.style.type === SimVarControlStyleTypes.RANGE
                    ) && (
                        <EditableSimVarControlValue
                            value={state}
                            unit={simVarControl.varUnit}
                            onInput={handleSetState}
                        />
                    )}

                    {simVarControl.style.type === SimVarControlStyleTypes.RANGE && (
                        <RangeSimVarControl
                            min={simVarControl.style.min}
                            max={simVarControl.style.max}
                            step={simVarControl.style.step}
                            value={state}
                            onInput={handleSetState}
                        />
                    )}

                    {simVarControl.style.type === SimVarControlStyleTypes.CHECKBOX && (
                        <CheckboxSimVarControl
                            state={state}
                            onInput={handleSetState}
                        />
                    )}

                    <button type="button" className="ml-auto text-teal-light ml-auto" onClick={() => setEditorShown((old) => !old)}>Edit</button>
                </div>
            </div>

            {editorShown && (
                <SimVarControlEditor
                    originalControl={simVarControl}
                    onCancel={() => setEditorShown(false)}
                    onSave={onEdit}
                />
            )}
        </div>
    );
};

interface EditableSimVarControlValueProps {
    value: number,
    unit: string,
    onInput: (v: number | string) => void,
}

const EditableSimVarControlValue: FC<EditableSimVarControlValueProps> = ({ value, unit, onInput }) => {
    const editSpanRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (editSpanRef.current) {
            editSpanRef.current.textContent = String(value);
        }
    }, [value]);

    const handleBlur = useCallback((e: FocusEvent) => {
        onInput((e.target as HTMLElement).textContent);
    }, [onInput]);

    return (
        <code className="font-semibold text-teal-light">
            <span
                ref={editSpanRef}
                contentEditable
                suppressContentEditableWarning
                className="outline-none bg-navy-dark rounded-md p-1"
                onBlur={handleBlur}
            />
            {' '}
            {unit}
        </code>
    );
};

interface RangeSimVarControlProps {
    min: number,
    max: number,
    step: number,
    value: number,
    onInput: (v: number) => void,
}

const RangeSimVarControl: FC<RangeSimVarControlProps> = ({ min, max, step, value, onInput }) => {
    const valuePercentage = Math.round((value / max) * 100);

    return (
        <div className="mb-1 ml-auto">
            <input
                style={{ background: `linear-gradient(to right, #136177 0%, #136177 ${valuePercentage}%, #36465E ${valuePercentage}%, #36465E 100%)` }}
                className="w-full}"
                type="range"
                value={value}
                onChange={(e) => onInput(parseInt(e.target.value))}
                min={min}
                max={max}
                step={step}
            />
        </div>
    );
};

interface CheckboxSimVarControlProps {
    state: number,
    onInput: (v: number) => void,
}

const CheckboxSimVarControl: FC<CheckboxSimVarControlProps> = ({ state, onInput }) => (
    <input
        className="ml-4 ml-auto"
        type="checkbox"
        checked={state !== 0}
        onChange={(e) => onInput(e.target.checked ? 1 : 0)}
    />
);
