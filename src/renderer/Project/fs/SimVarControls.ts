import { v4 as UUID } from 'uuid';
import { ListConfig } from './GenericListConfigHandler';
import { SimVarControl, SimVarControlStyleTypes } from '../../../shared/types/project/SimVarControl';
import { GenericProjectListConfigHandler } from './GenericProjectListConfigHandler';
import { SimVarPrefix } from '../../../../ace-engine/src/SimVar';

export class SimVarControlsHandler extends GenericProjectListConfigHandler<SimVarControl> {
    get fileName(): string {
        return 'simvars.json';
    }

    createConfig(): ListConfig<SimVarControl> {
        return {
            elements: [
                {
                    __uuid: UUID(),
                    title: 'Altitude',
                    varPrefix: SimVarPrefix.A,
                    varName: 'INDICATED ALTITUDE',
                    varUnit: 'ft',
                    style: {
                        type: SimVarControlStyleTypes.Range,
                        min: 0,
                        max: 40_000,
                        step: 1,
                    },
                },
                {
                    __uuid: UUID(),
                    title: 'Indicated Airspeed',
                    varPrefix: SimVarPrefix.A,
                    varName: 'AIRSPEED INDICATED',
                    varUnit: 'kn',
                    style: {
                        type: SimVarControlStyleTypes.Range,
                        min: 0,
                        max: 400,
                        step: 1,
                    },
                },
                {
                    __uuid: UUID(),
                    title: 'True Heading',
                    varPrefix: SimVarPrefix.A,
                    varName: 'PLANE HEADING DEGREES TRUE',
                    varUnit: 'deg',
                    style: {
                        type: SimVarControlStyleTypes.Range,
                        min: 0,
                        max: 359,
                        step: 1,
                    },
                },
                {
                    __uuid: UUID(),
                    title: 'Pitch',
                    varPrefix: SimVarPrefix.A,
                    varName: 'PLANE PITCH DEGREES',
                    varUnit: 'deg',
                    style: {
                        type: SimVarControlStyleTypes.Range,
                        min: -90,
                        max: 90,
                        step: 1,
                    },
                },
                {
                    __uuid: UUID(),
                    title: 'Bank',
                    varPrefix: SimVarPrefix.A,
                    varName: 'PLANE BANK DEGREES',
                    varUnit: 'deg',
                    style: {
                        type: SimVarControlStyleTypes.Range,
                        min: -90,
                        max: 90,
                        step: 1,
                    },
                },
            ],
        };
    }
}
