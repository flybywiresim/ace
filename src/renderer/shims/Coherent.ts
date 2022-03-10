// eslint-disable-next-line max-classes-per-file
class CoherentEvent {
    name: string;

    callback: (data: string) => void;

    constructor(name: string, callback: (data: string) => void) {
        this.name = name;
        this.callback = callback;
    }
}

export enum CoherentEventType {
    TRIGGER,
    NEW_ON,
    CLEAR_ON,
    CALL,
}

export type CoherentActivity =
    { type: CoherentEventType.TRIGGER, name: string, data: string } |
    { type: CoherentEventType.NEW_ON, name: string, callback: (data: string) => void } |
    { type: CoherentEventType.CLEAR_ON, name: string, callback: (data: string) => void } |
    { type: CoherentEventType.CALL, name: string, args: any[] };

export class Coherent {
    private events: CoherentEvent[] = [];

    private subscriptions: ((data: CoherentActivity) => void)[] = [];

    private notifySubscribers(data: CoherentActivity) {
        this.subscriptions.forEach((subscription) => subscription(data));
    }

    /**
     * Special function for subscribing to any activity occurring in Coherent, for monitoring triggers, ons, and calls which may have happened within the displays.
     * @param callback
     */
    public subscribe(callback: (data: CoherentActivity) => void) {
        this.subscriptions.push(callback);
    }

    public unSubscribe(callback: (data: CoherentActivity) => void) {
        this.subscriptions.splice(this.subscriptions.indexOf(callback), 1);
    }

    public trigger(name: string, data: string) {
        console.log(`Coherent Event: ${name} triggered`);
        this.events.forEach((e) => (e.name === name ? e.callback(data) : {}));
        this.notifySubscribers({ type: CoherentEventType.TRIGGER, name, data });
    }

    public on(name: string, callback: (data: string) => void) {
        console.log(`Coherent Event ${name} set on`);
        const event = new CoherentEvent(name, callback);
        this.events.push(event);
        this.notifySubscribers({ type: CoherentEventType.NEW_ON, name, callback });
        return {
            clear: () => {
                this.events.splice(this.events.indexOf(event), 1);
                this.notifySubscribers({ type: CoherentEventType.NEW_ON, name, callback });
            },
        };
    }

    public call<T>(name: string, ...args: any[]): Promise<T> {
        console.log(`Coherent Called: ${name}, with args: ${args}`);
        this.notifySubscribers({ type: CoherentEventType.CALL, name, args });
        return new Promise(() => null);
    }
}
