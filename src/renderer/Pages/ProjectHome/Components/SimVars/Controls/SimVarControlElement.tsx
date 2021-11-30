import React, { FC, FocusEvent, useCallback, useEffect, useRef, useState } from 'react';
import { IconPencil } from '@tabler/icons';
import { SimVarControl, SimVarControlStyle, SimVarControlStyleTypes } from '../../../../../../shared/types/project/SimVarControl';

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
    onEdit?: () => void,
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

        return normalizeTextValue(JSON.parse(rawValue) ?? defaultValueForControlStyle(simVarControl.style));
    });

    const defaultValueForControlStyle = (style: SimVarControlStyle) => {
        switch (style.type) {
        case SimVarControlStyleTypes.CHECKBOX:
            return false;
        case SimVarControlStyleTypes.NUMBER:
            return 0;
        case SimVarControlStyleTypes.RANGE:
            return (style.min + style.max) / 2;
        case SimVarControlStyleTypes.TEXT_INPUT:
            return '';
        default:
            return 0;
        }
    };

    useEffect(() => {
        const normalizedValue = normalizeTextValue(state);

        window.localStorage.setItem(simVarControl.varName, String(normalizedValue));

        if (valueRef.current && document.activeElement !== valueRef.current) {
            valueRef.current.innerText = state;
        }
    }, [simVarControl.varName, state]);

    return (
        <div className="py-3.5">
            <div className="flex flex-col justify-start gap-y-4">
                <h1 className="text-lg font-medium">{simVarControl.title}</h1>

                <div className="flex flex-row justify-end items-center gap-x-3.5">
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

                    <IconPencil
                        size={28}
                        className="text-gray-500 cursor-pointer hover:text-green-500"
                        onClick={onEdit}
                    />
                </div>
            </div>
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
        <code className="mr-auto font-semibold">
            <span
                ref={editSpanRef}
                contentEditable
                suppressContentEditableWarning
                className="inline-block outline-none bg-navy-medium text-green-500 rounded-md px-2 py-1"
                onBlur={handleBlur}
                style={{
                    minWidth: '4rem',
                    maxWidth: '8rem',
                }}
            />
            {' '}
            <span className="text-green-400">
                {unit}
            </span>
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
    const valuePercentage = Math.round(((value - min) / (max - min)) * 100);

    return (
        <div className="mb-1 ml-auto">
            <input
                style={{ background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${valuePercentage}%, #36465E ${valuePercentage}%, #36465E 100%)` }}
                className="w-44"
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
