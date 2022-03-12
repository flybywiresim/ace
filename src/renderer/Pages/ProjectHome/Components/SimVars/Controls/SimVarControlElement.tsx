import React, { FC, FocusEvent, useCallback, useEffect, useRef, useState } from 'react';
import { IconPencil, IconTrash } from '@tabler/icons';
import {
    SimVarControl,
    SimVarControlStyle,
    SimVarControlStyleTypes,
} from '../../../../../../shared/types/project/SimVarControl';
import { useProjectDispatch, useProjectSelector } from '../../../Store';
import { setSimVarValue } from '../../../Store/actions/simVarValues.actions';

interface SimVarEditorProps {
    simVarControl: SimVarControl,
    onEdit?: () => void,
    onDelete?: () => void,
}

export const SimVarControlElement: React.FC<SimVarEditorProps> = ({ simVarControl, onEdit, onDelete }) => {
    const simVarValue = useProjectSelector((state) => state.simVarValues[`${simVarControl.varPrefix}:${simVarControl.varName}`]);
    const projectDispatch = useProjectDispatch();

    const valueRef = useRef<HTMLSpanElement>();

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

    const [state, setState] = useState<any>(() => simVarValue ?? defaultValueForControlStyle(simVarControl.style));

    useEffect(() => {
        setState(simVarValue ?? defaultValueForControlStyle(simVarControl.style));
    }, [simVarControl.style, simVarValue]);

    const handleSetValue = useCallback((value) => {
        let actualValue = value;

        switch (simVarControl.style.type) {
        case SimVarControlStyleTypes.NUMBER:
        case SimVarControlStyleTypes.RANGE:
            const numberValue = parseFloat(value);

            actualValue = numberValue;
            break;
        case SimVarControlStyleTypes.CHECKBOX:
            actualValue = !!value;
            break;
        default:
            break;
        }

        projectDispatch(setSimVarValue({
            variable: {
                prefix: simVarControl.varPrefix,
                name: simVarControl.varName,
                unit: simVarControl.varUnit,
            },
            value: actualValue,
        }));
    }, [projectDispatch, simVarControl.style.type, simVarControl.varName, simVarControl.varPrefix, simVarControl.varUnit]);

    useEffect(() => {
        projectDispatch(setSimVarValue({
            variable: {
                prefix: simVarControl.varPrefix,
                name: simVarControl.varName,
                unit: simVarControl.varUnit,
            },
            value: state,
        }));

        if (valueRef.current && document.activeElement !== valueRef.current) {
            valueRef.current.innerText = state;
        }
    }, [projectDispatch, simVarControl.varName, simVarControl.varPrefix, simVarControl.varUnit, state]);

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
                            onInput={handleSetValue}
                        />
                    )}

                    {simVarControl.style.type === SimVarControlStyleTypes.RANGE && (
                        <RangeSimVarControl
                            min={simVarControl.style.min}
                            max={simVarControl.style.max}
                            step={simVarControl.style.step}
                            value={state}
                            onInput={handleSetValue}
                        />
                    )}

                    {simVarControl.style.type === SimVarControlStyleTypes.CHECKBOX && (
                        <CheckboxSimVarControl
                            state={state}
                            onInput={handleSetValue}
                        />
                    )}

                    <span className="flex gap-x-2">
                        <IconTrash
                            size={28}
                            className="text-gray-500 cursor-pointer hover:text-green-500"
                            onClick={onDelete}
                        />

                        <IconPencil
                            size={28}
                            className="text-gray-500 cursor-pointer hover:text-green-500"
                            onClick={onEdit}
                        />
                    </span>
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
                className="w-52"
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
