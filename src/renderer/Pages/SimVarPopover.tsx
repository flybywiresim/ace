import React, { useContext, useEffect, useRef } from 'react';
import SimVarEditorContext, { SimVarEditorContextProps } from './SimVarEditorContext';

type SimVarPopoverProps = {
    show: boolean;
    onCancel: () => void;
    onSave: () => void;
}

export const SimVarPopover: React.FC<SimVarPopoverProps> = ({ show, onCancel, onSave }: SimVarPopoverProps) => {
    const popoverRef = useRef<HTMLDivElement>();

    const context: SimVarEditorContextProps = useContext(SimVarEditorContext);

    const onMouseClick = (e: MouseEvent) => {
        const rect = popoverRef.current.getBoundingClientRect();
        if (e.x < rect.x || e.x > rect.x + rect.width || e.y < rect.y || e.y > rect.y + rect.height) {
            onCancel();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', onMouseClick);
        return () => {
            document.removeEventListener('mousedown', onMouseClick);
        };
    });

    return (
        <div ref={popoverRef} className={`${show ? 'visible' : 'hidden'} absolute -top-1/2 left-full bg-gray-700 bg-opacity-50 backdrop-blur-md rounded-md p-5 ml-3`}>
            <div className="flex flex justify-between mb-2">
                <div>
                    <p>Name</p>
                    <input className="w-36 mr-4" value={context.name} onChange={(e) => context.setName(e.target.value)} />
                </div>
                <div>
                    <p>Unit</p>
                    <input className="w-16" value={context.unit} onChange={(e) => context.setUnit(e.target.value)} />
                </div>
            </div>
            <div className="mb-2">
                <p>SimVar</p>
                <input className="w-full" value={context.simVar} onChange={(e) => context.setSimVar(e.target.value)} />
            </div>
            <div className="mb-2">
                <p>Input Type</p>
                <select className="w-full" onChange={(e) => context.setType(e.target.value)}>
                    <option value="text" selected={context.type === 'text'}>Text</option>
                    <option value="number" selected={context.type === 'number'}>Number</option>
                    <option value="range" selected={context.type === 'range'}>Range</option>
                    <option value="checkbox" selected={context.type === 'checkbox'}>Checkbox</option>
                </select>
            </div>
            <div className={`flex justify-between mb-2 ${context.type === 'range' ? 'visible' : 'hidden'}`}>
                <div>
                    <p>Min</p>
                    <input className="w-16" type="number" value={context.min} onChange={(e) => context.setMin(parseFloat(e.target.value))} />
                </div>
                <div>
                    <p>Max</p>
                    <input className="w-16" type="number" value={context.max} onChange={(e) => context.setMax(parseFloat(e.target.value))} />
                </div>
                <div>
                    <p>Step</p>
                    <input className="w-16" type="number" value={context.step} onChange={(e) => context.setStep(parseFloat(e.target.value))} />
                </div>
            </div>
            <button type="button" className="bg-gray-700 text-gray-300 mt-3 mr-2" onClick={onCancel}>Cancel</button>
            <button type="button" className="text-teal-light" onClick={onSave}>Save</button>
        </div>
    );
};
