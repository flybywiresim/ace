export type PanelGauge = {
    index: number,
    templateUrl: string,
    x: number,
    y: number,
    width: number,
    height: number,
}

export type PanelEntry = {
    index: number,
    gauges: PanelGauge[],
    sizeMM: {
        width: number,
        height: number,
    },
    sizePX: {
        width: number,
        height: number,
    },
}

export type PanelInstrument = {
    name: string,
    isInteractive: boolean,
    dimensions?: {
        mm: {
            width: number,
            height: number,
        },
        px: {
            width: number,
            height: number,
        }
    },
    position?: {
        x: number,
        y: number,
        width: number,
        height: number,
    }
}

export type PanelDef = PanelInstrument[];
