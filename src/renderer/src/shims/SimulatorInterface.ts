export interface SimulatorInterface {

    SimVar: {
        GetSimVarValue(key: string, unit: string): string | number,
        SetSimVarValue(key: string, unit: string, value: any): void
    }
    Simplane: {
        getPressureSelectedMode(): string,
        getAutoPilotDisplayedAltitudeLockValue(): number
        getAutoPilotAirspeedSelected(): number,
        getAutoPilotMachModeActive(): boolean
        getAutoPilotApproachLoaded(): boolean,
        getAutoPilotApproachType(): null
    };
    Coherent: {
        trigger(name: string, ...args: any[]): void,
        call<T>(name: string, ...args: any[]): Promise<T>,
    }
    Aircraft: {}

    GetStoredData(name: string): any

    SetStoredData(): void
}
