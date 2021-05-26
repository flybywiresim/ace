import * as fs from 'fs';
import { ConfigIniParser } from 'config-ini-parser';
import { PanelDef, PanelEntry, PanelGauge } from '../common/panel';

const PANEL_ENTRY_SIZE_FORMAT = /(\d+),\s*(\d+)/;
const PANEL_ENTRY_GAUGE_FORMAT = /(.*),\s*(\d+),\s*(\d+),\s*(\d+),\s*(\d+)/;

export function readPanel(path: string): PanelDef {
    const parser = new ConfigIniParser();

    const panelCfgText = fs.readFileSync(path).toString().replace(new RegExp('//.*\r?\n', 'g'), '');
    const panelCfg = parser.parse(panelCfgText);

    return {
        entries: panelCfg.sections()
            .filter((section) => section.startsWith('VCockpit'))
            .map((section) => readEntry(section, panelCfg)),
    };
}

function readEntry(sectionName: string, parser: ConfigIniParser): PanelEntry {
    const ret: Partial<PanelEntry> = {};

    try {
        const number = Number(sectionName.replace('VCockpit', ''));

        ret.index = number;
    } catch (e) {
        throw new Error('Panel entry heading must be of format /VCockpit\\d+/.');
    }

    // size_mm

    const sizeMMText: string = parser.get(sectionName, 'size_mm', null).trim();

    if (!sizeMMText) {
        throw new Error('Panel entry must specify size_mm.');
    }

    const sizeMMMatch = sizeMMText.match(PANEL_ENTRY_SIZE_FORMAT);

    if (!sizeMMMatch) {
        throw new Error(`Panel entry size_mm must be of format /\\d+,\\d+/, got '${sizeMMText}'.`);
    }

    const [, mmWidth, mmHeight] = sizeMMMatch.map((n) => Number(n));

    ret.sizeMM = { width: mmWidth, height: mmHeight };

    // pixel_size

    const sizePXText: string = parser.get(sectionName, 'pixel_size', null).trim();

    if (!sizePXText) {
        throw new Error('Panel entry must specify pixel_size.');
    }

    const sizePXMatch = sizeMMText.match(PANEL_ENTRY_SIZE_FORMAT);

    if (!sizePXMatch) {
        throw new Error(`Panel entry size_mm must be of format /\\d+,\\d+/, got '${sizePXText}'.`);
    }

    const [, pxWidth, pxHeight] = sizePXMatch.map((n) => Number(n));

    ret.sizePX = { width: pxWidth, height: pxHeight };

    // Gauges

    const gauges = [];
    if (parser.isHaveOption(sectionName, 'htmlgauge00')) {
        let entryIndex = 0;
        while (true) {
            const parameterName = `htmlgauge${entryIndex.toString().padStart(2, '0')}`;

            if (entryIndex === 0 || parser.isHaveOption(sectionName, parameterName)) {
                entryIndex++;

                gauges.push(readGauge(sectionName, entryIndex, parameterName, parser));
            } else {
                break;
            }
        }
    }

    ret.gauges = gauges;

    return ret as PanelEntry;
}

function readGauge(entrySectionName: string, index: number, parameterName: string, parser: ConfigIniParser): PanelGauge {
    const gaugeString = parser.get(entrySectionName, parameterName) as string;

    const match = gaugeString.match(PANEL_ENTRY_GAUGE_FORMAT);

    if (!match) {
        throw new Error(`Panel entry gauge must be of format /${PANEL_ENTRY_GAUGE_FORMAT.source}/, got '${gaugeString}'.`);
    }

    const templateUrl = match[1];
    const x = Number(match[2]);
    const y = Number(match[3]);
    const width = Number(match[4]);
    const height = Number(match[5]);

    return { index, templateUrl, x, y, width, height };
}
