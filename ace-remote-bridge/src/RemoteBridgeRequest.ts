import { SimVarValue } from 'ace-engine/src/SimVar';

export enum RemoteBridgeControlCommand {
    ACKNOWLEDGE = 'ack',

    REFUSED = 'ref',
}

export enum RemoteBridgeRequestCommand {
    LOGIN_AS_ACE_CLIENT = 'lac',

    SIMVAR_SUBSCRIBE = 'ssv',

    SIMVAR_SET = 'stv',

    COHERENT_SUBSCRIBE = 'ces',
}

export enum RemoteBridgeDataCommand {
    START_FRAME = 'ssf',

    END_FRAME = 'esf',

    SIMVAR_VALUE = 'svv',

    SIMVAR_SET_NOTIFY = 'stn',

    COHERENT_TRIGGERED = 'cet',
}

type LoginAsAceClient = [command: RemoteBridgeRequestCommand.LOGIN_AS_ACE_CLIENT];

type SimVarSubscribe = [command: RemoteBridgeRequestCommand.SIMVAR_SUBSCRIBE, name: string, unit: string, id: number];

type SimVarSet = [command: RemoteBridgeRequestCommand.SIMVAR_SET, requestId: number, name: string, unit: string, value: SimVarValue];

type CoherentSubscribe = [command: RemoteBridgeRequestCommand.COHERENT_SUBSCRIBE, event: string];

export type RemoteBridgeRequestMessage = LoginAsAceClient | SimVarSubscribe | SimVarSet | CoherentSubscribe

export type RecievedCommand = RemoteBridgeControlCommand | RemoteBridgeDataCommand
