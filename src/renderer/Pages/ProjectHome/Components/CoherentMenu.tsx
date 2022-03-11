import React from 'react';
import { IconTrash } from '@tabler/icons';
import { useProjectSelector } from '../Store';
import { SideMenu } from './Framework/Toolbars';

const { highlight } = require('highlight.js');

export const CoherentMenu = () => {
    const events = useProjectSelector((state) => state.coherent.events);

    return (
        <SideMenu className="w-[480px] bg-navy z-50 overflow-auto">
            <h2 className="mb-3 font-medium">Coherent</h2>
            <div className="flex flex-col divide-y divide-gray-700">
                {[...events].sort((a, b) => b.creationTimestamp.getTime() - a.creationTimestamp.getTime()).map((event) => (
                    <div className="flex flex-col justify-start gap-y-4 py-3.5">
                        <div className="flex flex-row justify-between items-center gap-x-3.5">
                            <h1 className="text-lg">{event.name}</h1>
                            <span className="ml-auto font-mono text-gray-300">
                                {event.creationTimestamp.getHours().toString().padStart(2, '0')}
                                :
                                {event.creationTimestamp.getMinutes().toString().padStart(2, '0')}
                                :
                                {event.creationTimestamp.getSeconds().toString().padStart(2, '0')}
                            </span>
                        </div>
                        <div className="flex flex-row justify-between items-center gap-x-3.5">
                            {event.callback && (
                                <code
                                    style={{ backgroundColor: 'rgba(34,52,76,0.5)', padding: '0.25rem' }}
                                    className="bg-black rounded"
                                    dangerouslySetInnerHTML={{ __html: highlight(event.callback.toString(), { language: 'javascript' }).value }}
                                />
                            )}
                            <IconTrash
                                size={28}
                                className="text-gray-500 cursor-pointer hover:text-green-500"
                                onClick={() => event.clear()}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </SideMenu>
    );
};
