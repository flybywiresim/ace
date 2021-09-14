import React, { FC, useState } from 'react';
import { IconArrowsMaximize, IconBulb, IconChevronLeft, IconPencil, IconVariable } from '@tabler/icons';
import { Toolbar, ToolbarItem, ToolbarItemColors, ToolbarSeparator } from './Components/Toolbars';
import { SimVarEditor, SimVarEditorProps } from '../SimVars/SimVarEditor';
import { SimVarEditorContext, SimVarEditorContextProps } from '../SimVars/SimVarEditorContext';
import { SimVarPopover } from '../SimVars/SimVarPopover';

export const InteractionToolbar: FC = () => (
    <Toolbar>
        <ToolbarItem renderPopover={() => (
            <SimVarMenu />
        )}
        >
            <IconVariable size={64} strokeWidth={1.5} />
        </ToolbarItem>

        <ToolbarItem color={ToolbarItemColors.RED}>
            <IconBulb size={64} strokeWidth={1.5} />
        </ToolbarItem>

        <ToolbarSeparator />

        <ToolbarItem color={ToolbarItemColors.PURPLE}>
            <IconPencil size={64} strokeWidth={1.5} />
        </ToolbarItem>

        <ToolbarItem color={ToolbarItemColors.GREEN}>
            <IconArrowsMaximize size={64} strokeWidth={1.5} />
        </ToolbarItem>

        <ToolbarSeparator />

        <ToolbarItem color={ToolbarItemColors.TRANSLUCENT}>
            <IconChevronLeft size={48} strokeWidth={1.25} />
        </ToolbarItem>
    </Toolbar>
);

const SimVarMenu: FC = () => {
    const [showNewSimVarPopover, setShowNewSimVarPopover] = useState(false);
    const [newName, setNewName] = useState<string>();
    const [newUnit, setNewUnit] = useState<string>();
    const [newSimVar, setNewSimVar] = useState<string>();
    const [newType, setNewType] = useState<string>();
    const [newMin, setNewMin] = useState<number>();
    const [newMax, setNewMax] = useState<number>();
    const [newStep, setNewStep] = useState<number>();

    const context: SimVarEditorContextProps = {
        name: newName,
        setName: setNewName,
        unit: newUnit,
        setUnit: setNewUnit,
        simVar: newSimVar,
        setSimVar: setNewSimVar,
        type: newType,
        setType: setNewType,
        min: newMin,
        setMin: setNewMin,
        max: newMax,
        setMax: setNewMax,
        step: newStep,
        setStep: setNewStep,
    };

    const [simVarEditors, setSimVarEditors] = useState<SimVarEditorProps[]>([]);

    const onSave = () => {
        setSimVarEditors((editors) => [
            ...editors,
            {
                initialState: context.type === 'number' || context.type === 'range' ? 0 : '',
                name: context.name,
                unit: context.unit,
                simVar: context.simVar,
                type: context.type,
                min: context.min,
                max: context.max,
                step: context.step,
            },
        ]);
        setShowNewSimVarPopover(false);
        setNewName('');
        setNewUnit('');
        setNewSimVar('');
        setNewType('');
        setNewMin(0);
        setNewMax(0);
        setNewStep(0);
    };

    return (
        <section className="w-72">
            <h2 className="mb-3 font-medium">SimVars</h2>
            <SimVarEditor name="Altitude" unit="ft" simVar="INDICATED ALTITUDE" initialState={0} type="range" min={0} max={41000} />
            <SimVarEditor name="Airspeed" unit="kn" simVar="AIRSPEED INDICATED" initialState={0} type="range" min={0} max={400} />
            <SimVarEditor name="Heading" unit="deg" simVar="PLANE HEADING DEGREES TRUE" initialState={0} type="range" min={0} max={359} />
            <SimVarEditor name="Pitch" unit="deg" simVar="PLANE PITCH DEGREES" initialState={0} type="range" min={-90} max={90} />
            <SimVarEditor name="Roll" unit="deg" simVar="PLANE BANK DEGREES" initialState={0} type="range" min={-90} max={90} />
            {simVarEditors.map((props) => (
                <SimVarEditor
                    initialState={props.type}
                    name={props.name}
                    unit={props.unit}
                    simVar={props.simVar}
                    type={props.type}
                    min={props.min}
                    max={props.max}
                    step={props.step}
                />
            ))}
            <div className="relative">
                <button
                    type="button"
                    className="w-full mt-3"
                    onClick={() => setShowNewSimVarPopover(true)}
                >
                    Add SimVars
                </button>
                <SimVarEditorContext.Provider value={context}>
                    <SimVarPopover
                        show={showNewSimVarPopover}
                        onCancel={() => setShowNewSimVarPopover(false)}
                        onSave={onSave}
                    />
                </SimVarEditorContext.Provider>
            </div>
        </section>
    );
};
