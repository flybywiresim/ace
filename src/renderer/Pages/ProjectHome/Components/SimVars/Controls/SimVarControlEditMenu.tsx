import React, { FC, FormEvent, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import {
    SimVarControl,
    SimVarControlStyle,
    SimVarControlStyleTypes,
} from '../../../../../../shared/types/project/SimVarControl';
import { SideMenu } from '../../Framework/Toolbars';
import { SelectBox, SelectBoxItem, SelectBoxItemBody, SelectBoxItemIcon } from '../../Framework/MenuBoxes';
import { useProjectDispatch } from '../../../Store';
import { addControl, editControl } from '../../../Store/actions/simVarElements.actions';
import { simVarDefinitionFromName, SimVarValue } from '../../../../../../../ace-engine/src/SimVar';

export interface SimVarControlEditMenuProps {

    /**
     * If not set, the component will be in "create a new control" mode
     */
    control?: SimVarControl,

    onClose?: () => void,

}

export const SimVarControlEditMenu: FC<SimVarControlEditMenuProps> = ({ control, onClose }) => {
    const [title, setTitle] = useState('');
    const [varName, setVarName] = useState('');
    const [varUnit, setVarUnit] = useState('');
    const [controlStyleType, setControlStyleType] = useState<SimVarControlStyleTypes>(SimVarControlStyleTypes.TextInput);
    const [rangeMin, setRangeMin] = useState('');
    const [rangeMax, setRangeMax] = useState('');
    const [rangeStep, setRangeStep] = useState('');
    const [value, setValue] = useState('');
    const [valueHighlighted, setValueHighlighted] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const handleControlStyleTypeSelected = setControlStyleType;

    // Update states if a control to edit is provided
    useEffect(() => {
        if (control) {
            setTitle(control.title);
            setVarName(`${control.varPrefix}:${control.varName}`);
            setVarUnit(control.varUnit);
            setControlStyleType(control.style.type);
            if (control.style.type === SimVarControlStyleTypes.Range) {
                setRangeMin(control.style.min.toString());
                setRangeMax(control.style.max.toString());
                setRangeStep(control.style.step.toString());
            }

            if (control.style.type === SimVarControlStyleTypes.Button) {
                setValue(control.style.value.toString());
            }
        }
    }, [control]);

    // Highlight boolean values

    useEffect(() => {
        const trimmedValue = value.trim();

        if (trimmedValue === 'true' || trimmedValue === 'false') {
            setValueHighlighted(true);
        } else {
            setValueHighlighted(false);
        }
    }, [value]);

    const handleInputChanged = (e: FormEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
        setter(e.currentTarget.value);
    };

    const [canSubmit, setCanSubmit] = useState(false);

    useEffect(() => {
        if (controlStyleType === SimVarControlStyleTypes.Range) {
            if ([rangeMin, rangeMax, rangeStep].every((value) => value.match(/\d+/))) {
                const stepCount = (parseFloat(rangeMax) - parseFloat(rangeMin)) / parseFloat(rangeStep);

                if (Math.round(stepCount) !== stepCount) {
                    setError('Total range must be divisible by step');
                    setCanSubmit(false);
                } else {
                    setError(null);
                    setCanSubmit(
                        [title, varName, varUnit].every((value) => value.match(/\w+/)),
                    );
                }
            }
        } else {
            setCanSubmit(
                [title, varName, varUnit].every((value) => value.match(/\w+/)),
            );
        }
    }, [controlStyleType, rangeMax, rangeMin, rangeStep, title, varName, varUnit]);

    const projectDispatch = useProjectDispatch();

    const handleSubmit = () => {
        const def = simVarDefinitionFromName(varName, varUnit);

        let style: SimVarControlStyle;
        switch (controlStyleType) {
        case SimVarControlStyleTypes.Range:
            const min = parseFloat(rangeMin);
            const max = parseFloat(rangeMax);
            const step = parseFloat(rangeStep);

            style = {
                type: controlStyleType,
                min,
                max,
                step,
            };
            break;
        case SimVarControlStyleTypes.Button:
            let actualValue: SimVarValue;

            if (value.trim() === 'true' || value === 'false') {
                actualValue = JSON.parse(value.trim());
            } else {
                const numValue = parseFloat(value);

                if (!Number.isNaN(numValue)) {
                    actualValue = numValue;
                } else {
                    actualValue = value;
                }
            }

            style = {
                type: controlStyleType,
                value: actualValue,
            };
            break;
        default:
            style = {
                type: controlStyleType,
            };
        }

        const data = {
            __uuid: control?.__uuid,
            title,
            varPrefix: def.prefix,
            varName: def.name,
            varUnit: def.unit,
            style,
        };

        if (control) {
            projectDispatch(editControl(data));
        } else {
            projectDispatch(addControl({
                ...data,
                __uuid: v4(),
            }));
        }

        onClose();
    };

    return (
        <SideMenu className="w-[400px] bg-navy-light-contrast z-40">
            <h2 className="mb-7 font-medium">
                {control ? 'Edit' : 'New'}
                {' '}
                SimVar Control
            </h2>

            <div className="h-full flex flex-col items-stretch self-stretch">
                <div className="flex flex-col items-stretch">
                    <input value={title} onInput={(e) => handleInputChanged(e, setTitle)} placeholder="Title" className="min-w-0 flex-grow font-mono" />
                </div>

                <h3>SimVar</h3>
                <div className="flex flex-col items-stretch gap-y-3.5">
                    <input value={varName} onInput={(e) => handleInputChanged(e, setVarName)} placeholder="Name" className="min-w-0 flex-grow font-mono" />
                    <input value={varUnit} onInput={(e) => handleInputChanged(e, setVarUnit)} placeholder="Unit" className="min-w-0 flex-grow font-mono" />
                </div>

                <h3>Control Style</h3>
                <SelectBox selectedItemIndex={controlStyleType} onItemSelected={handleControlStyleTypeSelected}>
                    <SelectBoxItem>
                        <SelectBoxItemIcon />

                        <SelectBoxItemBody>
                            Text Input
                        </SelectBoxItemBody>
                    </SelectBoxItem>

                    <SelectBoxItem>
                        <SelectBoxItemIcon />

                        <SelectBoxItemBody>
                            Number
                        </SelectBoxItemBody>
                    </SelectBoxItem>

                    <SelectBoxItem>
                        <SelectBoxItemIcon />

                        <SelectBoxItemBody>
                            Range
                        </SelectBoxItemBody>
                    </SelectBoxItem>

                    <SelectBoxItem>
                        <SelectBoxItemIcon />

                        <SelectBoxItemBody>
                            Checkbox
                        </SelectBoxItemBody>
                    </SelectBoxItem>

                    <SelectBoxItem>
                        <SelectBoxItemIcon />

                        <SelectBoxItemBody>
                            Button
                        </SelectBoxItemBody>
                    </SelectBoxItem>
                </SelectBox>

                {controlStyleType === SimVarControlStyleTypes.Range && (
                    <>
                        <h3>Range Settings</h3>

                        <div className="flex flex-row gap-x-3 5 items-center justify-stretch">
                            <input value={rangeMin} onInput={(e) => handleInputChanged(e, setRangeMin)} placeholder="Min" className="min-w-0" type="text" />
                            <input value={rangeMax} onInput={(e) => handleInputChanged(e, setRangeMax)} placeholder="Max" className="min-w-0" type="text" />
                            <input value={rangeStep} onInput={(e) => handleInputChanged(e, setRangeStep)} placeholder="Step" className="min-w-0" type="text" />
                        </div>

                        <span className="text-red-500 mt-1.5">{error}</span>
                    </>
                )}

                {controlStyleType === SimVarControlStyleTypes.Button && (
                    <>
                        <h3>Button Settings</h3>

                        <div className="flex flex-row gap-x-3 5 items-center justify-stretch">
                            <input
                                value={value}
                                onInput={(e) => handleInputChanged(e, setValue)}
                                placeholder="Value"
                                className={`w-full min-w-0 font-mono ${valueHighlighted ? 'text-green-500' : ''}`}
                                type="text"
                            />
                        </div>
                    </>
                )}

                <div className="w-full flex flex-row items-center gap-x-3.5 mt-auto">
                    <button onClick={() => onClose()} className="flex-1 box-border border-2 border-gray-700 bg-transparent" type="button">Cancel</button>
                    <button onClick={handleSubmit} disabled={!canSubmit} className="flex-1 box-border border-2 border-transparent bg-green-500" type="button">Save</button>
                </div>
            </div>
        </SideMenu>
    );
};
