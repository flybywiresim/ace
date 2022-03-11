/* eslint-disable react/no-danger */
import React, { FC } from 'react';
import Collapsible from 'react-collapsible';
import { IconArrowRight } from '@tabler/icons';
import ReactJson from 'react-json-view';
import { SideMenu } from '../Framework/Toolbars';
import { useProjectSelector } from '../../Store';
import {
    Activity,
    ActivityType, CoherentEventActivity,
    CoherentTriggerCallActivity, DataStorageSetActivity,
    SimVarSetActivity,
} from '../../Store/reducers/coherent.reducer';

const UNIMPORTANT_COHERENT_TRIGGERS = ['FOCUS_INPUT_FIELD', 'UNFOCUS_INPUT_FIELD'];

interface ActivityHeaderProps {
    activity: Activity,
}

const ActivityHeader: FC<ActivityHeaderProps> = ({ activity }) => {
    const opacityClass = activity.kind === ActivityType.CoherentTrigger && UNIMPORTANT_COHERENT_TRIGGERS.includes(activity.event) ? 'opacity-60' : '';

    return (
        <div className={`flex items-center py-1.5 ${opacityClass}`}>
            <ActivityHeaderTitle kind={activity.kind} />

            <span className="ml-auto font-mono text-gray-300">
                {activity.timestamp.getHours().toString().padStart(2, '0')}
                :
                {activity.timestamp.getMinutes().toString().padStart(2, '0')}
                :
                {activity.timestamp.getSeconds().toString().padStart(2, '0')}
            </span>
        </div>
    );
};

interface ActivityHeaderTitleProps {
    kind: ActivityType,
}

const ActivityHeaderTitle: FC<ActivityHeaderTitleProps> = ({ kind }) => {
    switch (kind) {
    case ActivityType.SimVarSet:
        return (
            <span className="text-md font-mono flex gap-x-1 text-gray-400">
                <span className="text-yellow-300">SimVar</span>
                <span>/</span>
                <span>Set</span>
            </span>
        );
    case ActivityType.CoherentTrigger:
        return (
            <span className="text-md font-mono flex gap-x-1 text-gray-400">
                <span className="text-red-500">Coherent</span>
                <span>/</span>
                <span>Trigger</span>
            </span>
        );
    case ActivityType.CoherentCall:
        return (
            <span className="text-md font-mono flex gap-x-1 text-gray-400">
                <span className="text-red-500">Coherent</span>
                <span>/</span>
                <span>Call</span>
            </span>
        );
    case ActivityType.CoherentNewOn:
        return (
            <span className="text-md font-mono flex gap-x-1 text-gray-400">
                <span className="text-red-500">Coherent</span>
                <span>/</span>
                <span>New Event</span>
            </span>
        );
    case ActivityType.CoherentClearOn:
        return (
            <span className="text-md font-mono flex gap-x-1 text-gray-400">
                <span className="text-red-500">Coherent</span>
                <span>/</span>
                <span>Clear Event</span>
            </span>
        );
    case ActivityType.DataStorageSet:
        return (
            <span className="text-md font-mono flex gap-x-1 text-gray-400">
                <span className="text-green-500">DataStorage</span>
                <span>/</span>
                <span>Set</span>
            </span>
        );
    default:
        return <span>Unknown</span>;
    }
};

export const CoherentMenu = () => {
    const activity = useProjectSelector((store) => store.coherent.activity);

    return (
        <SideMenu className="w-[500px] bg-navy z-50 overflow-auto">
            <h2 className="mb-3 font-medium">Timeline</h2>

            <div className="flex flex-col divide-y divide-gray-700">
                {[...activity].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((event) => (
                    <Collapsible trigger={<ActivityHeader activity={event} />} transitionTime={100}>
                        <div className="text-md pb-2.5">
                            {event.kind === ActivityType.SimVarSet && (
                                <SimVarSetActivityData activity={event} />
                            )}

                            {(event.kind === ActivityType.CoherentTrigger || event.kind === ActivityType.CoherentCall) && (
                                <CoherentTriggerCallActivityData activity={event} />
                            )}

                            {(event.kind === ActivityType.CoherentNewOn || event.kind === ActivityType.CoherentClearOn) && (
                                <CoherentEventActivityData activity={event} />
                            )}

                            {event.kind === ActivityType.DataStorageSet && (
                                <DataStorageSetActivityData activity={event} />
                            )}
                        </div>
                    </Collapsible>
                ))}
            </div>
        </SideMenu>
    );
};

interface SimVarSetActivityDataProps {
    activity: SimVarSetActivity,
}

const SimVarSetActivityData: FC<SimVarSetActivityDataProps> = ({ activity }) => (
    <div className="flex flex-row items-center gap-x-2">
        <span className="font-mono bg-gray-700 px-1.5 rounded-sm">
            (
            {activity.variable.prefix}
            :
            {activity.variable.name}
            {', '}
            {activity.variable.unit}
            )
        </span>

        <IconArrowRight className="ml-auto" size={16} />

        <span className="font-mono bg-gray-700 px-1.5 rounded-sm">{activity.value}</span>
    </div>
);

interface CoherentTriggerActivityDataProps {
    activity: CoherentTriggerCallActivity,
}

const CoherentTriggerCallActivityData: FC<CoherentTriggerActivityDataProps> = ({ activity }) => (
    <div className="flex flex-col gap-y-2.5 items-start">
        <span className="font-mono bg-gray-700 px-1.5 rounded-sm">
            {activity.event}
        </span>

        {activity.args.map((arg, index) => (
            <span className="flex gap-x-2">
                <span>{index}</span>

                {typeof arg === 'object'
                    ? (
                        <ReactJson
                            src={arg}
                            style={{ backgroundColor: 'rgb(55 65 81)', borderRadius: '0.125rem', padding: '0.25rem' }}
                            theme="bright"
                            displayDataTypes={false}
                            displayObjectSize={false}
                            collapsed
                        />
                    )
                    : <span className="font-mono bg-gray-700 px-1.5 rounded-sm">{JSON.stringify(arg)}</span>}
            </span>
        ))}
    </div>
);

interface CoherentEventActivityDataProps {
    activity: CoherentEventActivity,
}

const CoherentEventActivityData: FC<CoherentEventActivityDataProps> = ({ activity }) => (
    <div className="flex flex-col gap-y-2.5 items-start">
        <span className="font-mono bg-gray-700 px-1.5 rounded-sm">
            {activity.event}
        </span>
    </div>
);

interface DataStorageSetActivityDataProps {
    activity: DataStorageSetActivity,
}

const DataStorageSetActivityData: FC<DataStorageSetActivityDataProps> = ({ activity }) => (
    <div className="flex flex-row items-center gap-x-2">
        <span className="font-mono bg-gray-700 px-1.5 rounded-sm">
            {activity.key}
        </span>

        <IconArrowRight className="ml-auto" size={16} />

        <span className="font-mono bg-gray-700 px-1.5 rounded-sm">{activity.value}</span>
    </div>
);
