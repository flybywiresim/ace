export interface SimulatorInterface {

    SimVar: {
        GetSimVarValue(name): string | number,
        SetSimVarValue(): void
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
