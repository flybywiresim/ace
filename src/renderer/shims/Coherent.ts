// eslint-disable-next-line max-classes-per-file
class CoherentEvent {
    name: string;

    callback: (...data: any[]) => void;

    constructor(name: string, callback: (...data: any[]) => void) {
        this.name = name;
        this.callback = callback;
    }
}

export class Coherent {
    private events: CoherentEvent[] = [];

    public trigger(name: string, ...data: any[]) {
        this.events.forEach((e) => (e.name === name ? e.callback(...data) : {}));
    }

    public on(name: string, callback: (...data: any[]) => void): { clear: () => void } {
        const event = new CoherentEvent(name, callback);
        this.events.push(event);
        return {
            clear: () => {
                this.events.splice(this.events.indexOf(event), 1);
            },
        };
    }

    public call<T>(_name: string, ..._args: any[]): Promise<T> {
        return new Promise(() => null);
    }
}
