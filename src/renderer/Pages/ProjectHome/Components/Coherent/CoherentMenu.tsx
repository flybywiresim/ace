import React from 'react';
import { SideMenu } from '../Framework/Toolbars';
import { useProjectSelector } from '../../Store';
import { CoherentEventType } from '../../../../shims/Coherent';

export const CoherentMenu = () => {
    const activity = useProjectSelector((store) => store.coherent.activity);

    return (
        <SideMenu className="w-[420px] bg-navy z-50">
            <h2 className="mb-3 font-medium">Coherent</h2>
            <div className="flex flex-col divide-y divide-gray-700">
                {activity.map((event) => (
                    <div className="py-3.5">
                        <h4>
                            Name:
                            {' '}
                            {event.name}
                        </h4>
                        <h4>
                            Type:
                            {' '}
                            {CoherentEventType[event.type]}
                        </h4>
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {event.type === CoherentEventType.TRIGGER
                            ? (
                                <h4>
                                    Data:
                                    {' '}
                                    <tspan className="bg-gray-600 italic rounded">{event.data}</tspan>
                                </h4>
                            )
                            : event.type === CoherentEventType.NEW_ON || event.type === CoherentEventType.CLEAR_ON
                                ? (
                                    <h4>
                                        Callback:
                                        {' '}
                                        <tspan className="bg-gray-600 italic rounded">{event.callback.toString()}</tspan>
                                    </h4>
                                )
                                : event.args.map((arg, index) => (
                                    <h4>
                                        {'Argument '}
                                        {index}
                                        {': '}
                                        <tspan className="bg-gray-600 italic rounded">
                                            {JSON.stringify(arg)}
                                        </tspan>
                                    </h4>
                                ))}
                    </div>
                ))}
            </div>
        </SideMenu>
    );
};
