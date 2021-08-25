import { SimulatorInterface } from './SimulatorInterface';

export class LocalShim implements SimulatorInterface {
    public SimVar = {
        GetSimVarValue(key, unit) {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : 0 || '';
            } catch (error) {
                console.log(error);
                return 0 || '';
            }
        },
        SetSimVarValue(key, unit, value) {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.log(error);
            }
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
        getAutoPilotApproachType() {
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
