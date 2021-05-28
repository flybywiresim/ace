import { InstrumentDef } from '../Panel';

export async function getInstrumentList(): Promise<InstrumentDef[]> {
    const request = await fetch('/api/instruments');

    return request.json();
}

export async function getInstrumentBundle(name: string): Promise<{ js: string, css: string }> {
    const request = await fetch(`/api/instrument/${name}`);

    return request.json();
}
