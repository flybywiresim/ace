import { SimulatorInterface } from './SimulatorInterface';

export class LocalShim implements SimulatorInterface {
    public SimVar = {
        GetSimVarValue(key: string, _unit: string) {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : 0 || '';
            } catch (error) {
                console.log(error);
                return 0 || '';
            }
        },
        SetSimVarValue(key: string, _unit: string, value: any) {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.log(error);
            }
        },
    }

    public Coherent = {
        trigger(name: string, ...args: any[]) {
            console.log(`Coherent triggered: ${name}, with args: ${args}`);
        },
        call<T>(name: string, ...args: any[]): Promise<T> {
            console.log(`Coherent Called: ${name}, with args: ${args}`);
            return null;
        },
    }

    public Simplane = {
        getPressureSelectedMode() {
            return 'Std';
        },
        getAutoPilotDisplayedAltitudeLockValue() {
            return 0;
        },
        getAutoPilotAirspeedSelected() {
            return 0;
        },
        getAutoPilotMachModeActive() {
            return true;
        },
        getAutoPilotApproachLoaded() {
            return true;
        },
        getAutoPilotApproachType(): any {
            return null;
        },
    };

    public Aircraft = {}

    public GetStoredData = (key: string): any => {
        if (key === 'A32NX_CONFIG_SELF_TEST_TIME') {
            return 2;
        }
        return 0;
    }

    public SetStoredData = () => {
    }
}
