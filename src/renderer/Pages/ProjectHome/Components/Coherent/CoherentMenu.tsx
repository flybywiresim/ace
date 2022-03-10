/* eslint-disable react/no-danger */
import React from 'react';
import ReactJson from 'react-json-view';
import Collapsible from 'react-collapsible';
import { SideMenu } from '../Framework/Toolbars';
import { useProjectSelector } from '../../Store';
import { CoherentEventType } from '../../../../shims/Coherent';

const { highlight } = require('highlight.js/lib/common');

export const CoherentMenu = () => {
    const activity = useProjectSelector((store) => store.coherent.activity);

    return (
        <SideMenu className="w-[420px] bg-navy z-50 overflow-auto">
            <h2 className="mb-3 font-medium">Coherent</h2>
            <div className="flex flex-col divide-y divide-gray-700">
                {activity.map((event) => (
                    <Collapsible trigger={event.name} transitionTime={100}>
                        <h4 className="italic">
                            {CoherentEventType[event.type]}
                        </h4>
                        {/* eslint-disable-next-line no-nested-ternary */}
                        {event.type === CoherentEventType.TRIGGER ? (
                            event.data && (
                                <h4
                                    style={{ backgroundColor: 'rgba(34,52,76,0.5)', padding: '0.25rem' }}
                                    className="bg-gray-600 rounded"
                                >
                                    {event.data}
                                </h4>
                            )
                        )
                            : (event.type === CoherentEventType.NEW_ON || event.type === CoherentEventType.CLEAR_ON)
                                ? (
                                    event.callback && (
                                        <h4>
                                            <code
                                                style={{ backgroundColor: 'rgba(34,52,76,0.5)', padding: '0.25rem' }}
                                                className="bg-black rounded"
                                                dangerouslySetInnerHTML={{ __html: highlight(event.callback.toString(), { language: 'javascript' }).value }}
                                            />
                                        </h4>
                                    )
                                )
                                : (
                                    <div className="flex flex-col divide-y divide-gray-700">
                                        {event.args.map((arg) => (
                                            typeof arg === 'object' ? (
                                                <ReactJson
                                                    src={arg}
                                                    style={{ backgroundColor: 'rgba(34,52,76,0.5)', padding: '0.25rem' }}
                                                    theme="bright"
                                                    displayDataTypes={false}
                                                    displayObjectSize={false}
                                                    collapsed
                                                />
                                            ) : (
                                                <h4 style={{ backgroundColor: 'rgba(34,52,76,0.5)', padding: '0.25rem' }}>
                                                    {arg.toString()}
                                                </h4>
                                            )
                                        ))}
                                    </div>
                                )}
                        <h4 className="text-xs text-slate-400 italic">
                            {event.time.getHours().toString().padStart(2, '0')}
                            :
                            {event.time.getMinutes().toString().padStart(2, '0')}
                            :
                            {event.time.getSeconds().toString().padStart(2, '0')}
                        </h4>
                    </Collapsible>
                ))}
            </div>
        </SideMenu>
    );
};
