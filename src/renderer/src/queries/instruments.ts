import { InstrumentDef } from '../Panel';

const fs = window.require('fs');
export function getInstrumentList(): InstrumentDef[] {
    const instruments = fs.readdirSync('../src/', { withFileTypes: true })
        .filter((d: { isDirectory: () => any; name: any; }) => d.isDirectory() && fs.existsSync(`../src/${d.name}/config.json`))
        .map((d: { name: any; }) => d.name);

    return instruments.map((instrument: any) => ({
        name: instrument,
        path: `src/${instrument}`,
    }));
}

export function getInstrumentBundle(directory: string): { js: string, css: string } {
    const js = fs.readFileSync(`./bundles/${directory}/bundle.js`).toString();
    const css = fs.readFileSync(`./bundles/${directory}/bundle.css`).toString();

    return { js, css };
}
