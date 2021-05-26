export interface SimulatorInterface {

    SimVar: {
        GetSimVarValue(name): string | number,
        SetSimVarValue(): void
    }

    GetStoredData(name: string): any

    SetStoredData(): void

    Simplane: {
        getPressureSelectedMode(): string,
        getAutoPilotDisplayedAltitudeLockValue(): number
        getAutoPilotAirspeedSelected(): number,
        getAutoPilotMachModeActive(): boolean
        getAutoPilotApproachLoaded(): boolean,
        getAutoPilotApproachType(): null
    };

    Aircraft: {}
}
