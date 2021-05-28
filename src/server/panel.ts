import * as fs from 'fs';
import * as path from 'path';
import { PanelDef, PanelInstrument } from '../common/panel';

export function readPanelUnsafe(instrumentsSrcPath: string): PanelDef {
    const instruments: PanelInstrument[] = [];

    const dirents = fs.readdirSync(instrumentsSrcPath, { withFileTypes: true })
        .filter((ent) => ent.isDirectory())
        .filter((dir) => fs.existsSync(path.join(instrumentsSrcPath, dir.name, 'config.json')))
        .map((ent) => ent.name);

    for (const dirent of dirents) {
        const instrumentConfigJson = JSON.parse(fs.readFileSync(path.join(instrumentsSrcPath, dirent, 'config.json')).toString()) as PanelInstrument;

        instrumentConfigJson.name = dirent;

        instruments.push(instrumentConfigJson);
    }

    return instruments;
}
