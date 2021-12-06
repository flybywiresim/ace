import { Coherent } from './Coherent';
import { SimulatorInterface } from './SimulatorInterface';
import { ViewListener } from './RegisterViewListener';

export class LocalShim implements SimulatorInterface {
    public Coherent = new Coherent();

    public RegisterViewListener = (name: string): ViewListener => new ViewListener(name, this.Coherent);

    public SimVar = {
        GetSimVarValue(key: any) {
            try {
                const item = window.localStorage.getItem(key);
                return item ? JSON.parse(item) : 0;
            } catch (error) {
                console.log(error);
                return 0;
            }
        },
        SetSimVarValue(key: any, unit: any, value: any) {
            try {
                window.localStorage.setItem(key, JSON.stringify(value));

                return new Promise(((resolve) => resolve(null)));
            } catch (error) {
                console.log(error);

                return new Promise((_, reject) => reject());
            }
        },
        GetGameVarValue(): string {
            return 'whoopdy woo';
        },
    }

    public Simplane = {
        getPressureValue() {
            return 1013;
        },
        getPressureSelectedMode() {
            return 'Std';
        },
        getPressureSelectedUnits() {
            return 'millibar';
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
        getAutoPilotApproachType(): null {
            return null;
        },
        getTotalFuel() {
            return 69420;
        },
        getCurrentUTC() {
            return 42069;
        },
        getNextWaypointName() {
            return 'never gonna give you up never gonna let you down';
        },
        getNextWaypointTrack() {
            return 80080135;
        },
        getNextWaypointETA() {
            return Math.min();
        },
        getNextWaypointDistance() {
            return Math.max();
        },
    };

    public Aircraft = {}

    public GetStoredData = (key: string): any => {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            console.log(error);
        }
        return '';
    }

    public SetStoredData = (key: string, value: any): any => {
        if (typeof value !== 'string') {
            throw Error('SetStoredData: Illegal type of value! value must be of type string');
        }
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            console.log(error);
        }
        return null;
    }
}
