import { Coherent } from './Coherent';

export class ViewListener {
    name: string;

    coherent: Coherent;

    constructor(name: string, coherent: Coherent) {
        this.name = name;
        this.coherent = coherent;
    }

    public trigger(_name: string, ..._data: any[]) {
        // noop
    }

    public triggerToAllSubscribers(name: string, ...data: any[]) {
        if (this.name === 'JS_LISTENER_SIMVARS') {
            this.coherent.trigger(name, ...data);
        }
    }

    public on(_event: string, _callback: (...data: any[]) => void, _context: any): void {
        // noop
    }

    public off(_event: string, _callback: (...data: any[]) => void, _context: any): void {
        // noop
    }

    public call(_name: string, _args: any[]): void {
        // noop
    }

    public unregister(): void {
        // noop
    }
}
