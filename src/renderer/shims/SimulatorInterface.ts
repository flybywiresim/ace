export interface SimulatorInterface {

    SimVar: {
        GetSimVarValue(key: any, unit: any): string | number,
        SetSimVarValue(key: any, unit: any, value: any): void,
        GetGameVarValue(key: any, unit: any): string | number,
    }
    Simplane: {
        getPressureSelectedMode(): string,
        getAutoPilotDisplayedAltitudeLockValue(): number
        getAutoPilotAirspeedSelected(): number,
        getAutoPilotMachModeActive(): boolean
        getAutoPilotApproachLoaded(): boolean,
        getAutoPilotApproachType(): null,
        getTotalFuel(): void,
        getCurrentUTC(): number,
        getNextWaypointTrack(): number,
        getNextWaypointETA(): number,
        getNextWaypointDistance(): number,
    };
    Coherent: {
        trigger(name: string, ...args: any[]): void,
        call<T>(name: string, ...args: any[]): Promise<T>,
    };
    Aircraft: {}

    GetStoredData(name: string): any

    SetStoredData(): void
}
