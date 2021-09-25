import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SimVarControl, SimVarControlStyle, SimVarControlStyleTypes } from '../../../shared/types/project/SimVarControl';

type SimVarControlEditorProps = {
    originalControl: SimVarControl,
    onCancel: () => void;
    onSave: (control: SimVarControl) => void;
}

export const SimVarControlEditor: React.FC<SimVarControlEditorProps> = ({ originalControl, onCancel, onSave }) => {
    const popoverRef = useRef<HTMLDivElement>();

    const [newTitle, setNewTitle] = useState<string>(originalControl.title);
    const [newVarName, setNewVarName] = useState<string>(originalControl.varName);
    const [newVarUnit, setNewVarUnit] = useState<string>(originalControl.varUnit);
    const [newStyle, setNewStyle] = useState<SimVarControlStyle>(originalControl.style);

    const onMouseClick = (e: MouseEvent) => {
        const rect = popoverRef.current.getBoundingClientRect();
        if (e.x < rect.x || e.x > rect.x + rect.width || e.y < rect.y || e.y > rect.y + rect.height) {
            onCancel();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', onMouseClick);

        return () => document.removeEventListener('mousedown', onMouseClick);
    });

    const handleSetNewStyle = useCallback((type: SimVarControlStyleTypes) => {
        switch (type) {
        case SimVarControlStyleTypes.TEXT_INPUT:
            setNewStyle({ type: SimVarControlStyleTypes.TEXT_INPUT });
            break;
        case SimVarControlStyleTypes.NUMBER:
            setNewStyle({ type: SimVarControlStyleTypes.NUMBER });
            break;
        case SimVarControlStyleTypes.RANGE:
            setNewStyle({ type: SimVarControlStyleTypes.RANGE, min: 0, max: 100, step: 1 });
            break;
        case SimVarControlStyleTypes.CHECKBOX:
            setNewStyle({ type: SimVarControlStyleTypes.CHECKBOX });
            break;
        default:
            throw new Error(`Unknown SimVarControlStyleType '${type}'.`);
        }
    }, []);

    const handleSave = useCallback(() => {
        onSave({
            __uuid: originalControl.__uuid,
            title: newTitle,
            varPrefix: originalControl.varPrefix,
            varName: newVarName,
            varUnit: newVarUnit,
            style: newStyle,
        });
    }, [newTitle, newVarName, newStyle, newVarUnit, onSave, originalControl.__uuid]);

    return (
        <div ref={popoverRef} className="absolute -top-1/2 left-full bg-gray-700 bg-opacity-50 backdrop-blur-md rounded-md p-5 ml-3">
            <div className="flex flex justify-between mb-2">
                <div>
                    <p>Name</p>
                    <input className="w-36 mr-4" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                </div>
                <div>
                    <p>Unit</p>
                    <input className="w-16" value={newVarUnit} onChange={(e) => setNewVarUnit(e.target.value)} />
                </div>
            </div>
            <div className="mb-2">
                <p>SimVar</p>
                <input className="w-full" value={newVarName} onChange={(e) => setNewVarName(e.target.value)} />
            </div>

            <div className="mb-2">
                <p>Input Type</p>
                <select className="w-full" onChange={(e) => handleSetNewStyle(parseInt(e.target.value) as any as SimVarControlStyleTypes)}>
                    <option value={SimVarControlStyleTypes.TEXT_INPUT} selected={newStyle.type === SimVarControlStyleTypes.TEXT_INPUT}>Text</option>
                    <option value={SimVarControlStyleTypes.NUMBER} selected={newStyle.type === SimVarControlStyleTypes.NUMBER}>Number</option>
                    <option value={SimVarControlStyleTypes.RANGE} selected={newStyle.type === SimVarControlStyleTypes.RANGE}>Range</option>
                    <option value={SimVarControlStyleTypes.CHECKBOX} selected={newStyle.type === SimVarControlStyleTypes.CHECKBOX}>Checkbox</option>
                </select>
            </div>

            {newStyle.type === SimVarControlStyleTypes.RANGE && (
                <div className="flex justify-between mb-2">
                    <div>
                        <p>Min</p>
                        <input
                            className="w-16"
                            type="number"
                            value={newStyle.min}
                            onChange={(e) => setNewStyle((old) => ({ ...old, min: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <p>Max</p>
                        <input
                            className="w-16"
                            type="number"
                            value={newStyle.max}
                            onChange={(e) => setNewStyle((old) => ({ ...old, max: parseFloat(e.target.value) }))}
                        />
                    </div>
                    <div>
                        <p>Step</p>
                        <input
                            className="w-16"
                            type="number"
                            value={newStyle.step}
                            onChange={(e) => setNewStyle((old) => ({ ...old, step: parseFloat(e.target.value) }))}
                        />
                    </div>
                </div>
            )}

            <button type="button" className="bg-gray-700 text-gray-300 mt-3 mr-2" onClick={onCancel}>Cancel</button>
            <button type="button" className="text-teal-light" onClick={handleSave}>Save</button>
        </div>
    );
};
