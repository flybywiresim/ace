import { SimVarValue } from 'ace-engine/src/SimVar';
import {
    RecievedCommand,
    RemoteBridgeControlCommand,
    RemoteBridgeDataCommand,
    RemoteBridgeRequestCommand,
    RemoteBridgeRequestMessage,
} from './RemoteBridgeRequest';

export enum RemoteBridgeClientState {
    Initializing,

    FailedToLogin,

    Connected,

    LoggedIn,
}

/**
 * WebSocket component for the remote bridge.
 *
 * Connects from ACE to the managing server.
 */
export class RemoteBridgeAceClient {
    state = RemoteBridgeClientState.Initializing;

    private ws: WebSocket;

    private queuedMessages: string[] = [];

    simVarState: Record<string, SimVarValue> = {};

    simVarSubscriptions: Record<number, string> = {};

    simVarSetCallbacks: Record<number, (rejected: boolean) => void> = {};

    coherentEventSubscriptions: [string, (...args: string[]) => void][] = [];

    connect(url: string): void {
        this.ws = new WebSocket(url);

        this.ws.addEventListener('open', () => this.handleWsConnectedInternal());
    }

    private handleWsConnectedInternal() {
        console.log('[RemoteBridgeAceClient] Connected to ws.');

        this.ws.addEventListener('message', (e) => this.handleWsMessageInternal(e));

        this.state = RemoteBridgeClientState.Connected;

        this.sendMessageInternal([RemoteBridgeRequestCommand.LOGIN_AS_ACE_CLIENT]);
    }

    private handleWsMessageInternal(message: MessageEvent<any>) {
        const messageParts = message.data.split(';');

        const command: RecievedCommand = messageParts[0];
        switch (command) {
        case RemoteBridgeControlCommand.ACKNOWLEDGE: {
            if (this.state === RemoteBridgeClientState.Connected) {
                console.log('[RemoteBridgeClient] Logged in');
                this.state = RemoteBridgeClientState.LoggedIn;

                for (const queued of this.queuedMessages) {
                    this.ws.send(queued);
                }
            }
            break;
        }
        case RemoteBridgeControlCommand.REFUSED: {
            if (this.state === RemoteBridgeClientState.Connected) {
                this.state = RemoteBridgeClientState.FailedToLogin;
            } else {
                console.warn(`[RemoteBridgeClient] REFUSED recieved while not in Connected state (state=${this.state})`);
            }
            break;
        }
        case RemoteBridgeDataCommand.SIMVAR_VALUE: {
            const [, id, value] = messageParts;

            const key = this.simVarSubscriptions[id];

            const numberValue = parseFloat(value);

            this.simVarState[key] = Number.isNaN(numberValue) ? value : numberValue;
            break;
        }
        case RemoteBridgeDataCommand.SIMVAR_SET_NOTIFY: {
            const [, id, rejected] = messageParts;

            const callback = this.simVarSetCallbacks[id];

            if (callback) {
                callback(rejected === '1');
            }
            break;
        }
        case RemoteBridgeDataCommand.COHERENT_TRIGGERED: {
            const [, event, ...args] = messageParts;

            const subs = this.coherentEventSubscriptions.filter(([ev]) => ev === event);

            for (const sub of subs) {
                sub[1](...(args.map((it: string) => JSON.parse(it))));
            }
            break;
        }
        default:
            throw new Error(`[RemoteBridgeClient] Unknown command: ${command}`);
        }
    }

    sendMessageInternal(message: RemoteBridgeRequestMessage) {
        const messageString = message.map((element) => element.toString()).join(';');

        if (this.state >= RemoteBridgeClientState.Connected) {
            this.ws.send(messageString);
        } else if (this.state !== RemoteBridgeClientState.FailedToLogin) {
            this.queuedMessages.push(messageString);
        }
    }

    sendMessage(message: RemoteBridgeRequestMessage) {
        const messageString = message.map((element) => element.toString()).join(';');

        if (this.state >= RemoteBridgeClientState.LoggedIn) {
            this.ws.send(messageString);
        } else if (this.state !== RemoteBridgeClientState.FailedToLogin) {
            this.queuedMessages.push(messageString);
        }
    }
}
