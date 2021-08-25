export interface SimulatorInterface {

    SimVar: {
        GetSimVarValue(key, unit): string | number,
        SetSimVarValue(key, unit, value): void
    }
    Simplane: {
        getPressureSelectedMode(): string,
        getAutoPilotDisplayedAltitudeLockValue(): number
        getAutoPilotAirspeedSelected(): number,
        getAutoPilotMachModeActive(): boolean
        getAutoPilotApproachLoaded(): boolean,
        getAutoPilotApproachType(): null
    };
    Aircraft: {}

    GetStoredData(name: string): any

    SetStoredData(): void
}
