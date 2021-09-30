import React, { FC, useState } from 'react';
import { SimVarControl, SimVarControlStyleTypes } from '../../../../../../shared/types/project/SimVarControl';
import { SideMenu } from '../../Framework/Toolbars';
import { SelectBox, SelectBoxItem, SelectBoxItemBody, SelectBoxItemIcon } from '../../Framework/MenuBoxes';

export interface SimVarControlEditMenuProps {

    /**
     * If not set, the component will be in "create a new control" mode
     */
    control?: SimVarControl,

}

export const SimVarControlEditMenu: FC<SimVarControlEditMenuProps> = () => {
    const [selectedControlStyleType, setSelectedControlStyleType] = useState<SimVarControlStyleTypes>(SimVarControlStyleTypes.TEXT_INPUT);

    const handleControlStyleTypeSelected = setSelectedControlStyleType;

    return (
        <SideMenu className="w-[400px] bg-navy-light-contrast z-40">
            <h2 className="mb-7 font-medium">Edit SimVar Control</h2>

            <div className="h-full flex flex-col items-stretch self-stretch">
                <h3 className="mb-2">Title</h3>
                <input />

                <h3 className="mt-3 mb-2">SimVar</h3>
                <div className="flex flex-col items-stretch gap-y-3.5">
                    <input placeholder="Name" className="min-w-0 flex-grow font-mono" />
                    <input placeholder="Unit" className="min-w-0 flex-grow font-mono" />
                </div>

                <h3 className="mt-3 mb-2">Control Style</h3>
                <SelectBox selectedItemIndex={selectedControlStyleType} onItemSelected={handleControlStyleTypeSelected}>
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
                </SelectBox>

                {selectedControlStyleType === SimVarControlStyleTypes.RANGE && (
                    <>
                        <h3 className="mt-3 mb-2">Range Settings</h3>

                        <div className="flex flex-row gap-x-3 5 items-center justify-stretch">
                            <input placeholder="Min" className="min-w-0" type="text" />
                            <input placeholder="Max" className="min-w-0" type="text" />
                        </div>
                    </>
                )}

                <div className="w-full flex flex-row items-center gap-x-3.5 mt-auto">
                    <button className="flex-1 box-border border-2 border-gray-700 bg-transparent" type="button">Cancel</button>
                    <button className="flex-1 box-border border-2 border-transparent bg-green-500" type="button">Save</button>
                </div>
            </div>
        </SideMenu>
    );
};
