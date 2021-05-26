import { SimulatorInterface } from './SimulatorInterface';

export class LocalShim implements SimulatorInterface {
    public SimVar = {
        GetSimVarValue(name) {
            if (name) {
                if (name === 'L:A32NX_ELEC_AC_ESS_BUS_IS_POWERED') {
                    return 1;
                }
                if (name.startsWith('LIGHT POTENTIOMETER')) {
                    return 100;
                }
            }
            return 0;
        },
        SetSimVarValue() {

        },
    }

    public GetStoredData= (key: string): any => {
        if (key === 'A32NX_CONFIG_SELF_TEST_TIME') {
            return 2;
        }
        return 0;
    }

    public SetStoredData = () => {}

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
}
