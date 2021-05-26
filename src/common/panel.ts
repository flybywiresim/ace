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

export type PanelDef = {
    entries: PanelEntry[],
}
