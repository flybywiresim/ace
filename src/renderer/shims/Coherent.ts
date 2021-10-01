// eslint-disable-next-line max-classes-per-file
class CoherentEvent {
    name: string;

    callback: (data: string) => void;

    constructor(name: string, callback: (data: string) => void) {
        this.name = name;
        this.callback = callback;
    }
}

export class Coherent {
    private events: CoherentEvent[] = [];

    public trigger(name: string, data: string) {
        console.log(`Coherent Event: ${name} triggered`);
        this.events.forEach((e) => (e.name === name ? e.callback(data) : {}));
    }

    public on(name: string, callback: (data: string) => void) {
        console.log(`Coherent Event ${name} set on`);
        const event = new CoherentEvent(name, callback);
        this.events.push(event);
        return {
            clear: () => {
                this.events.splice(this.events.indexOf(event), 1);
            },
        };
    }

    public call<T>(name: string, ...args: any[]): Promise<T> {
        console.log(`Coherent Called: ${name}, with args: ${args}`);
        return null;
    }
}
