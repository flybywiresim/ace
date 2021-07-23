import * as path from 'path';
import { PanelDef, PanelInstrument } from '../../../common/panel';

const fs = window.require('fs');

export function readPanelUnsafe(instrumentsSrcPath: string): PanelDef {
    const instruments: PanelInstrument[] = [];

    console.log(fs.readdirSync(instrumentsSrcPath));

    const dirents = fs.readdirSync(instrumentsSrcPath, { withFileTypes: true })
        .filter((ent: { isDirectory: () => any; }) => ent.isDirectory())
        .filter((dir: { name: string; }) => fs.existsSync(path.join(instrumentsSrcPath, dir.name, 'instrument.json')))
        .map((ent: { name: any; }) => {
            console.log(ent); return ent.name;
        });

    console.log(dirents);
    for (const dirent of dirents) {
        const instrumentConfigJson = JSON.parse(fs.readFileSync(path.join(instrumentsSrcPath, dirent, 'instrument.json')).toString()) as PanelInstrument;
        console.log(instrumentConfigJson);
        instrumentConfigJson.name = dirent;

        instruments.push(instrumentConfigJson);
    }
    console.log(instruments);

    return instruments;
}
