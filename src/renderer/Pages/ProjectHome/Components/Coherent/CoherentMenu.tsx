/* eslint-disable react/no-danger */
import React from 'react';
import ReactJson from 'react-json-view';
import { SideMenu } from '../Framework/Toolbars';
import { useProjectSelector } from '../../Store';
import { CoherentEventType } from '../../../../shims/Coherent';

const { highlight } = require('highlight.js/lib/common');

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
                        {event.type === CoherentEventType.TRIGGER ? (
                            <h4>
                                Data:
                                {' '}
                                {event.data && (
                                    <tspan
                                        style={{ backgroundColor: 'rgba(34,52,76,0.5)', padding: '0.25rem' }}
                                        className="bg-gray-600 rounded"
                                    >
                                        {event.data}
                                    </tspan>
                                )}
                            </h4>
                        )
                            : (event.type === CoherentEventType.NEW_ON || event.type === CoherentEventType.CLEAR_ON)
                                ? (
                                    <h4>
                                        Callback:
                                        {' '}
                                        {event.callback && (
                                            <code
                                                style={{ backgroundColor: 'rgba(34,52,76,0.5)', padding: '0.25rem' }}
                                                className="bg-black rounded"
                                                dangerouslySetInnerHTML={{ __html: highlight(event.callback.toString(), { language: 'javascript' }).value }}
                                            />
                                        )}
                                    </h4>
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
                    </div>
                ))}
            </div>
        </SideMenu>
    );
};
