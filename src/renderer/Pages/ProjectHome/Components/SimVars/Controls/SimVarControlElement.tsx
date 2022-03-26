import React, { FC, FocusEvent, useCallback, useEffect, useRef } from 'react';
import { IconPencil, IconTrash } from '@tabler/icons';
import {
    SimVarControl,
    SimVarControlStyle,
    SimVarControlStyleTypes,
} from '../../../../../../shared/types/project/SimVarControl';
import { useProjectDispatch, useProjectSelector } from '../../../Store';
import { setSimVarValue } from '../../../Store/actions/simVarValues.actions';
import { SimVarValue } from '../../../../../../../ace-engine/src/SimVar';

interface SimVarEditorProps {
    simVarControl: SimVarControl,
    onEdit?: () => void,
    onDelete?: () => void,
}

export const defaultValueForControlStyle = (style: SimVarControlStyle) => {
    switch (style.type) {
    case SimVarControlStyleTypes.Checkbox:
        return false;
    case SimVarControlStyleTypes.Number:
        return 0;
    case SimVarControlStyleTypes.Range:
        return (style.min + style.max) / 2;
    case SimVarControlStyleTypes.Button:
        return style.value;
    case SimVarControlStyleTypes.TextInput:
        return '';
    default:
        return 0;
    }
};

export const SimVarControlElement: React.FC<SimVarEditorProps> = ({ simVarControl, onEdit, onDelete }) => {
    const projectDispatch = useProjectDispatch();

    const scaleFactor = useRef(1);

    const simVarValue = useProjectSelector((state) => state.simVarValues[`${simVarControl.varPrefix}:${simVarControl.varName}`]) ?? defaultValueForControlStyle(simVarControl.style);

    if (simVarControl.style.type === SimVarControlStyleTypes.Range) {
        const { step } = simVarControl.style;

        // Chrome doesn't play well with decimal range slider steps, so we find a scalar
        if (Math.round(step) !== step) {
            let wholeStep = step;
            let factor = 1;
            let iterations = 0;

            while (Math.round(wholeStep) !== wholeStep && iterations < 64) {
                iterations++;
                wholeStep *= 10;
                factor *= 10;
            }

            scaleFactor.current = factor;
        }
    }

    const handleSetValue = useCallback((value) => {
        let actualValue = value;

        switch (simVarControl.style.type) {
        case SimVarControlStyleTypes.Number:
        case SimVarControlStyleTypes.Range:
            const numberValue = parseFloat(value);

            actualValue = numberValue / scaleFactor.current;
            break;
        case SimVarControlStyleTypes.Checkbox:
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

    return (
        <div className="py-3.5">
            <div className="flex flex-col justify-start gap-y-4">
                <h1 className="text-lg font-medium">{simVarControl.title}</h1>

                <div className="flex flex-row justify-end items-center gap-x-3.5">
                    {(simVarControl.style.type === SimVarControlStyleTypes.TextInput
                        || simVarControl.style.type === SimVarControlStyleTypes.Number
                        || simVarControl.style.type === SimVarControlStyleTypes.Range
                        || simVarControl.style.type === SimVarControlStyleTypes.Button
                    ) && (
                        <EditableSimVarControlValue
                            value={simVarValue}
                            unit={simVarControl.varUnit}
                            onInput={handleSetValue}
                        />
                    )}

                    {simVarControl.style.type === SimVarControlStyleTypes.Range && (
                        <RangeSimVarControl
                            min={simVarControl.style.min * scaleFactor.current}
                            max={simVarControl.style.max * scaleFactor.current}
                            step={simVarControl.style.step * scaleFactor.current}
                            value={typeof simVarValue === 'number' ? simVarValue * scaleFactor.current : simVarValue}
                            onInput={handleSetValue}
                        />
                    )}

                    {simVarControl.style.type === SimVarControlStyleTypes.Checkbox && (
                        <CheckboxSimVarControl
                            state={simVarValue}
                            onInput={handleSetValue}
                        />
                    )}

                    {simVarControl.style.type === SimVarControlStyleTypes.Button && (
                        <ButtonSimVarControl
                            setterValue={simVarControl.style.value}
                            onClick={() => (simVarControl.style.type === SimVarControlStyleTypes.Button) && handleSetValue(simVarControl.style.value)}
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
    value: SimVarValue,
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
    value: SimVarValue,
    onInput: (v: number) => void,
}

const RangeSimVarControl: FC<RangeSimVarControlProps> = ({ min, max, step, value, onInput }) => {
    let numberValue;
    if (typeof value === 'number') {
        numberValue = value;
    } else if (typeof value === 'boolean') {
        numberValue = value ? 1 : 0;
    } else {
        numberValue = NaN;
    }

    const valuePercentage = Math.round(((numberValue - min) / (max - min)) * 100);

    return (
        <div className="mb-1 ml-auto">
            <input
                style={{ background: `linear-gradient(to right, rgb(16, 185, 129) 0%, rgb(16, 185, 129) ${valuePercentage}%, #36465E ${valuePercentage}%, #36465E 100%)` }}
                className="w-52"
                type="range"
                value={numberValue}
                onChange={(e) => onInput(parseInt(e.target.value))}
                min={min}
                max={max}
                step={step}
            />
        </div>
    );
};

interface CheckboxSimVarControlProps {
    state: SimVarValue,
    onInput: (v: number) => void,
}

const CheckboxSimVarControl: FC<CheckboxSimVarControlProps> = ({ state, onInput }) => {
    let booleanValue;
    if (typeof state === 'boolean') {
        booleanValue = state;
    } else if (typeof state === 'number') {
        booleanValue = state !== 0;
    } else {
        booleanValue = true; // FIXME not sure about this
    }

    return (
        <input
            className="ml-4 ml-auto"
            type="checkbox"
            checked={booleanValue}
            onChange={(e) => onInput(e.target.checked ? 1 : 0)}
        />
    );
};

interface ButtonSimVarControlProps {
    setterValue: SimVarValue,
    onClick: () => void,
}

const ButtonSimVarControl: FC<ButtonSimVarControlProps> = ({ setterValue, onClick }) => (
    <button className="h-10 px-2 flex justify-center items-center gap-x-2 text-gray-500 font-mono" type="button" onClick={onClick}>
        <span>-&gt; </span>
        <span className="text-green-500">{setterValue.toString()}</span>
    </button>
);
