import { Coherent } from './Coherent';

export class ViewListener {
    name: string;

    coherent: Coherent;

    constructor(name: string, coherent: Coherent) {
        this.name = name;
        this.coherent = coherent;
    }

    public triggerToAllSubscribers(name: string, ...data: any[]) {
        if (this.name === 'JS_LISTENER_SIMVARS') {
            this.coherent.trigger(name, ...data);
        }
    }
}
