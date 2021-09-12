import React, { useEffect, useRef, useState } from 'react';
import { SimVarEditorContext, SimVarEditorContextProps } from './SimVarEditorContext';
import { SimVarPopover } from './SimVarPopover';

export type SimVarEditorProps = {
    name: string;
    unit?: string;
    simVar: string;
    initialState?: any;
    type: string;
    max?: number;
    min?: number;
    step?: number;
};

export const SimVarEditor: React.FC<SimVarEditorProps> = ({ name, unit, simVar, initialState, type, max, min, step }: SimVarEditorProps) => {
    const valueRef = useRef<HTMLSpanElement>();

    const [state, setState] = useState<any>(initialState);
    const [forceRerender, setForceRerender] = useState(false);
    const [defaultName, setDefaultName] = useState(name);
    const [defaultUnit, setDefaultUnit] = useState(unit);
    const [defaultSimVar, setDefaultSimVar] = useState(simVar);
    const [defaultType, setDefaultType] = useState(type);
    const [defaultMin, setDefaultMin] = useState(min);
    const [defaultMax, setDefaultMax] = useState(max);
    const [defaultStep, setDefaultStep] = useState(step);

    const [showEditPopover, setShowEditPopover] = useState(false);
    const [editName, setEditName] = useState(name);
    const [editUnit, setEditUnit] = useState(unit);
    const [editSimVar, setEditSimVar] = useState(simVar);
    const [editType, setEditType] = useState(type);
    const [editMin, setEditMin] = useState(min);
    const [editMax, setEditMax] = useState(max);
    const [editStep, setEditStep] = useState(step);

    const context: SimVarEditorContextProps = {
        name: editName,
        setName: setEditName,
        unit: editUnit,
        setUnit: setEditUnit,
        simVar: editSimVar,
        setSimVar: setEditSimVar,
        type: editType,
        setType: setEditType,
        min: editMin,
        setMin: setEditMin,
        max: editMax,
        setMax: setEditMax,
        step: editStep,
        setStep: setEditStep,
    };

    const sliderPercentage = ((state - defaultMin) / (defaultMax - defaultMin)) * 100;

    const onSave = () => {
        setDefaultName(editName);
        setDefaultUnit(editUnit);
        setDefaultSimVar(editSimVar);
        setDefaultType(editType);
        setDefaultMin(editMin);
        setDefaultMax(editMax);
        setDefaultStep(editStep);
        if (editType === 'number' || editType === 'range') {
            setState(state || 0);
        } else {
            setState(state || '');
        }
        setShowEditPopover(false);
        setForceRerender(!forceRerender);
    };

    useEffect(() => {
        window.localStorage.setItem(defaultSimVar, JSON.stringify(state));
        if (document.activeElement !== valueRef.current) {
            valueRef.current.innerText = state;
        }
    }, [defaultSimVar, state]);

    return (
        <div className="relative">
            <div className="flex items-center mb-1">
                {defaultName}
                <code className={`font-semibold text-teal-light ml-3 ${defaultType === 'number' || defaultType === 'range' ? 'visible' : 'hidden'}`}>
                    <span
                        ref={valueRef}
                        contentEditable
                        suppressContentEditableWarning
                        className="outline-none bg-navy-dark rounded-md p-1"
                        onInput={(e) => setState(defaultType === 'number' || defaultType === 'range' ? parseFloat(e.currentTarget.textContent) || 0 : e.currentTarget.textContent || '')}
                        onBlur={() => {
                            valueRef.current.innerText = state;
                        }}
                    >
                        {initialState}
                    </span>
                    {' '}
                    {defaultUnit}
                </code>
                <input
                    className={`ml-4 ${defaultType === 'checkbox' ? 'visible' : 'hidden'}`}
                    type="checkbox"
                    checked={state}
                    onChange={(e) => setState(e.target.checked)}
                />
                <button type="button" className="ml-auto text-teal-light ml-auto" onClick={() => setShowEditPopover(true)}>Edit</button>
            </div>
            <div className="mb-3">
                <input
                    style={defaultType === 'range'
                        ? { background: `linear-gradient(to right, #136177 0%, #136177 ${sliderPercentage}%, #36465E ${sliderPercentage}%, #36465E 100%)` }
                        : {}}
                    className={`w-full ${defaultType === 'checkbox' ? 'hidden' : 'visible'}`}
                    type={defaultType}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    max={defaultMax}
                    min={defaultMin}
                    step={defaultStep}
                />
            </div>
            <SimVarEditorContext.Provider value={context}>
                <SimVarPopover
                    show={showEditPopover}
                    onCancel={() => setShowEditPopover(false)}
                    onSave={onSave}
                />
            </SimVarEditorContext.Provider>
        </div>
    );
};
