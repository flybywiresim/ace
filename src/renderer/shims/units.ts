// eslint-disable-next-line max-classes-per-file
export function normalizeUnit(units: string[][], unit: string): string | null {
    for (const unitSet of units) {
        if (unitSet.includes(unit.toLowerCase())) {
            return unitSet[0];
        }
    }
    return null;
}

export class Length {
    static units = [
        ['meter', 'meters', 'm'],
        ['centimeter', 'centimeters', 'cm'],
        ['kilometer', 'kilometers', 'km'],
        ['millimeter', 'millimeters'],
        ['mile', 'miles'],
        ['decimile', 'decimiles'],
        ['nautical mile', 'nautical miles', 'nmile', 'nmiles'],
        ['decinmile', 'decinmiles'],
        ['foot', 'feet', 'ft'],
        ['inch', 'inches', 'in'],
        ['yard', 'yards'],
    ];

    static conversions: Record<string, number> = {
        'meter': 1,
        'centimeter': 100,
        'kilometer': 0.001,
        'millimeter': 1000,
        'mile': 0.0006213711922,
        'decimile': 0.006213711922,
        'nautical mile': 0.000539956803,
        'decinmile': 0.00539956803,
        'foot': 3.280839895,
        'inch': 39.37007874,
        'yard': 1.093613298,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Length.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'meter';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Length.units, unit) ?? 'meter';
        this.value = (this.value / Length.conversions[this.unit]) * Length.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Area {
    static units = [
        ['square inch', 'square inches', 'sq in', 'in2'],
        ['square feet', 'square foot', 'sq ft', 'ft2'],
        ['square yard', 'square yards', 'sq yd', 'yd2'],
        ['square meter', 'square meters', 'sq m', 'm2'],
        ['square centimeter', 'square centimeters', 'sq cm', 'cm2'],
        ['square kilometer', 'square kilometers', 'sq km', 'km2'],
        ['square millimeter', 'square millimeters', 'sq mm', 'mm2'],
        ['square mile', 'square miles'],
    ];

    static conversions: Record<string, number> = {
        'square inch': 1,
        'square feet': 0.006944,
        'square yard': 0.000772,
        'square meter': 0.00064516,
        'square centimeter': 6.4516,
        'square kilometer': 0.00000000064516,
        'square millimeter': 645.16,
        'square mile': 0.0000000002491,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Area.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'square inch';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Area.units, unit) ?? 'square inch';
        this.value = (this.value / Area.conversions[this.unit]) * Area.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Volume {
    static units = [
        ['cubic inch', 'cubic inches', 'cu in', 'in3'],
        ['cubic foot', 'cubic feet', 'cu ft', 'ft3'],
        ['cubic yard', 'cubic yards', 'cu yd', 'yd3'],
        ['cubic mile', 'cubic miles'],
        ['cubic millimeter', 'cubic millimeters', 'cu mm', 'mm3'],
        ['cubic centimeter', 'cubic centimeters', 'cu cm', 'cm3'],
        ['cubic meter', 'cubic meters', 'meter cubed', 'meters cubed', 'cu m', 'm3'],
        ['cubic kilometer', 'cubic kilometers', 'cu km', 'km3'],
        ['liter', 'liters'],
        ['gallon', 'gallons'],
        ['quart', 'quarts'],
    ];

    static conversions: Record<string, number> = {
        'cubic inch': 1,
        'cubic foot': 0.000579,
        'cubic yard': 0.000021433,
        'cubic mile': 0.0000000000000039314646,
        'cubic millimeter': 16387.064,
        'cubic centimeter': 16.387064,
        'cubic meter': 0.000016387064,
        'cubic kilometer': 0.000000000000016387064,
        'liter': 0.016387,
        'gallon': 0.004329,
        'quart': 0.017316,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Volume.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'cubic inch';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Volume.units, unit) ?? 'cubic inch';
        this.value = (this.value / Volume.conversions[this.unit]) * Volume.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Temperature {
    static units = [
        ['kelvin'],
        ['rankine'],
        ['fahrenheit', 'farenheit'],
        ['celsius'],
    ];

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Temperature.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'kelvin';
    }

    toKelvin(unit: string): (value: number) => number {
        switch (unit) {
        case 'rankine':
            return (value: number) => value / 1.8;
        case 'fahrenheit':
            return (value: number) => (value + 459.67) / 1.8;
        case 'celsius':
            return (value: number) => value + 273.15;
        default:
            return (value: number) => value;
        }
    }

    fromKelvin(unit: string): (value: number) => number {
        switch (unit) {
        case 'rankine':
            return (value: number) => value * 1.8;
        case 'fahrenheit':
            return (value: number) => (value - 273.15) * 1.8 + 32;
        case 'celsius':
            return (value: number) => value - 273.15;
        default:
            return (value: number) => value;
        }
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Temperature.units, unit) ?? 'kelvin';
        this.value = this.fromKelvin(normalizedUnit)(this.toKelvin(this.unit)(this.value));
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Angle {
    static units = [
        ['radian', 'radians'],
        ['round', 'rounds'],
        ['degree', 'degrees'],
        ['degree latitude'],
        ['degree longitude'],
        ['grad', 'grads'],
    ];

    static conversions: Record<string, number> = {
        'radian': 1,
        'round': 0, // TODO
        'degree': 180 / Math.PI,
        'degree latitude': 0, // TODO
        'degree longitude': 0, // TODO
        'grad': 200 / Math.PI,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Angle.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'radian';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Angle.units, unit) ?? 'radian';
        this.value = (this.value / Angle.conversions[this.unit]) * Angle.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

// TODO: Global Position
// const globalPosition = [
//     ['degree latitude', 'degrees latitude'],
//     ['degree longitude', 'degrees longitude'],
//     ['meter latitude', 'meters latitude'],
// ];

export class AngularVelocity {
    static units = [
        ['radian per second', 'radians per second'],
        ['revolution per minute', 'revolutions per minute', 'rpm', 'rpms'],
        ['minute per round', 'minutes per round'],
        ['nice minute per round', 'nice minutes per round'],
        ['degree per second', 'degrees per second'],
    ];

    static conversions: Record<string, number> = {
        'radian per second': 1,
        'revolution per minute': 60 / (2 * Math.PI),
        'minute per round': 0, // TODO
        'nice minute per round': 0, // TODO
        'degree per second': 180 / Math.PI,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(AngularVelocity.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'radian';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(AngularVelocity.units, unit) ?? 'radian';
        this.value = (this.value / AngularVelocity.conversions[this.unit]) * AngularVelocity.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class AngularAcceleration {
    static units = [
        ['radian per second squared', 'radians per second squared'],
        ['degree per second squared', 'degrees per second squared'],
    ];

    static conversions: Record<string, number> = {
        'radian per second squared': 1,
        'degree per second squared': 1 / (Math.PI / 180),
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(AngularAcceleration.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'radian';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(AngularAcceleration.units, unit) ?? 'radian';
        this.value = (this.value / AngularAcceleration.conversions[this.unit]) * AngularAcceleration.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Speed {
    static units = [
        ['meter per second', 'meters/second', 'm/s'],
        ['meter per minute', 'meters per minute'],
        ['kilometers per hour', 'kilometer/hour', 'kilometers/hour', 'kph'],
        ['mile per hour', 'miles per hour', 'mph'],
        ['feet/second'],
        ['feet/minute', 'ft/min'],
        ['knot', 'knots'],
        ['mach', 'machs'],
    ];

    static conversions: Record<string, number> = {
        'meter per second': 1,
        'meter per minute': 60,
        'kilometers per hour': 3.6,
        'mile per hour': 2.23693629192,
        'feet/second': 3.280839895,
        'feet/minute': 196.8503937,
        'knot': 1.9438,
        'mach': 0.002915,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Speed.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'meter per second';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Speed.units, unit) ?? 'meter per second';
        this.value = (this.value / Speed.conversions[this.unit]) * Speed.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Acceleration {
    static units = [
        ['meter per second squared', 'meters per second squared'],
        ['gforce', 'g force'],
        ['feet per second squared', 'foot per second squared'],
    ];

    static conversions: Record<string, number> = {
        'meter per second squared': 1,
        'gforce': 1 / 9.80665,
        'feet per second squared': 3.2808399,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Acceleration.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'meter per second squared';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Acceleration.units, unit) ?? 'meter per second squared';
        this.value = (this.value / Acceleration.conversions[this.unit]) * Acceleration.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Time {
    static units = [
        ['second', 'seconds'],
        ['minute', 'minutes'],
        ['hour', 'hours'],
        ['day', 'days'],
        ['hour over 10', 'hours over 10'],
        ['year', 'years'],
    ];

    static conversions: Record<string, number> = {
        'second': 1,
        'minute': 1 / 60,
        'hour': 1 / 3600,
        'day': 1 / 86400,
        'hour over 10': 0, // TODO
        'year': 1 / 31557600,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Time.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'second';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Time.units, unit) ?? 'second';
        this.value = (this.value / Time.conversions[this.unit]) * Time.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Power {
    static units = [
        ['watt', 'watts'],
        ['ft lb per second'],
    ];

    static conversions: Record<string, number> = {
        'watt': 1,
        'ft lb per second': 0.737562,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Power.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'watt';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Power.units, unit) ?? 'watt';
        this.value = (this.value / Power.conversions[this.unit]) * Power.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class VolumeRate {
    static units = [
        ['meter cubed per second', 'meters cubed per second'],
        ['gallon per hour', 'gallons per hour', 'gph'],
        ['liter per hour', 'liters per hour'],
    ];

    static conversions: Record<string, number> = {
        'meter cubed per second': 1,
        'gallon per hour': 951019.38848933,
        'liter per hour': 3600000,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(VolumeRate.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'meter cubed per second';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(VolumeRate.units, unit) ?? 'meter cubed per second';
        this.value = (this.value / VolumeRate.conversions[this.unit]) * VolumeRate.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Weight {
    static units = [
        ['kilogram', 'kilograms', 'kg'],
        ['slug', 'slugs', 'geepound', 'geepounds'],
        ['pound', 'pounds', 'lbs'],
    ];

    static conversions: Record<string, number> = {
        kilogram: 1,
        slug: 0.0685217796,
        pound: 2.2046226218,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Weight.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'kilogram';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Weight.units, unit) ?? 'kilogram';
        this.value = (this.value / Weight.conversions[this.unit]) * Weight.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class WeightRate {
    static units = [
        ['kilogram per second', 'kilograms per second'],
        ['pound per hour', 'pounds per hour'],
    ];

    static conversions: Record<string, number> = {
        'kilogram per second': 1,
        'pound per hour': 132.277357,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(WeightRate.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'kilogram per second';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(WeightRate.units, unit) ?? 'kilogram per second';
        this.value = (this.value / WeightRate.conversions[this.unit]) * WeightRate.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class ElectricalCurrent {
    static units = [
        ['ampere', 'amperes', 'amp', 'amps'],
    ];

    value: number;

    unit: string;

    constructor(value: number, _unit: string) {
        this.value = value;
        this.unit = 'ampere';
    }

    convertTo(_unit: string): number {
        return this.value;
    }
}

export class ElectricalPotential {
    static units = [
        ['volt', 'volts'],
    ];

    value: number;

    unit: string;

    constructor(value: number, _unit: string) {
        this.value = value;
        this.unit = 'volt';
    }

    convertTo(_unit: string): number {
        return this.value;
    }
}

// TODO: Frequency
// const frequency = [
//     ['Hertz', 'Hz'],
//     ['Kilohertz', 'KHz'],
//     ['Megahertz', 'MHz'],
//     ['Frequency BCD32'],
//     ['Frequency BCD16'],
//     ['Frequency ADF BCD32'],
// ];
//

export class Density {
    static units = [
        ['kilogram per cubic meter', 'kilograms per cubic meter'],
        ['slug per cubic feet', 'slugs per cubic feet', 'slug/ft3', 'slug per cubic foot', 'slugsper cubic foot'],
        ['pound per gallon', 'pounds per gallon', 'lbs/gallon'],
    ];

    static conversions: Record<string, number> = {
        'kilogram per cubic meter': 1,
        'slug per cubic feet': 0.00194032,
        'pound per gallon,': 0.0083454,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Density.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'kilogram per cubic meter';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Density.units, unit) ?? 'kilogram per cubic meter';
        this.value = (this.value / Density.conversions[this.unit]) * Density.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Pressure {
    static units = [
        ['pascal', 'pascals', 'pa'],
        ['newton per square meter', 'newtons per square meter'],
        ['kilopascal', 'kpa'],
        ['kilogram force per square centimeter', 'kgfsqcm'],
        ['millimeters of mercury', 'millimeter of mercury', 'mmhg'],
        ['centimeters of mercury', 'centimeter of mercury', 'cmhg'],
        ['inches of mercury', 'inch of mercury', 'inhg'],
        ['atmosphere', 'atmospheres', 'atm'],
        ['millimeters of water', 'millimeter of water'],
        ['pound-force per square inch', 'psi'],
        ['pound-force per square foot', 'psf'],
        ['bar', 'bars'],
        ['millibar', 'millibars', 'mbar', 'mbars', 'hectopascal', 'hectopascals'],
        ['boost cmhg'],
        ['boost inhg'],
        ['boost psi'],
        ['slug feet squared', 'slugs feet squared'],
        ['kilogram meter squared', 'kilograms meter squared'],
    ];

    static conversions: Record<string, number> = {
        'pascal': 1,
        'newton per square meter': 1,
        'kilopascal': 0.001,
        'kilogram force per square centimeter': 0.000010197,
        'millimeters of mercury': 0.0075006,
        'centimeters of mercury': 0.00075006,
        'inches of mercury': 0.00029530,
        'atmosphere': 0.00000986923,
        'millimeters of water': 0.10197,
        'pound-force per square inch': 0.000145038,
        'pound-force per square foot': 0.0208854,
        'bar': 0.00001,
        'millibar': 0.01,
        'boost cmhg': 0, // TODO
        'boost inhg': 0, // TODO
        'boost psi': 0, // TODO
        'slug feet squared': 0.0208854342,
        'kilogram meter squared': 0.10197,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Pressure.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'pascal';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Pressure.units, unit) ?? 'pascal';
        this.value = (this.value / Pressure.conversions[this.unit]) * Pressure.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Torque {
    static units = [
        ['newton meter', 'newton', 'meters', 'nm'],
        ['foot-pound', 'foot pound', 'ft-lbs', 'foot-pounds'],
        ['lbf-feet'],
        ['kilogram meter', 'kilogram meters', 'kgf meter', 'kgf meters'],
        ['poundal feet'],
    ];

    static conversions: Record<string, number> = {
        'newton meter': 1,
        'foot-pound': 0.737562,
        'lbf-feet': 0.735294118,
        'kilogram meter': 0.10197,
        'poundal feet': 23.8095238,
    };

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Torque.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'newton meter';
    }

    convertTo(unit: string): number {
        const normalizedUnit = normalizeUnit(Torque.units, unit) ?? 'newton meter';
        this.value = (this.value / Torque.conversions[this.unit]) * Torque.conversions[normalizedUnit];
        this.unit = normalizedUnit;
        return this.value;
    }
}

export class Miscellaneous {
    static units = [
        ['part'],
        ['half', 'halfs'],
        ['third', 'thirds'],
        ['percent', 'percentage'],
        ['percent over 100'],
        ['bel', 'bels'],
        ['decibel', 'decibels'],
        ['more_than_a_half'],
        ['times'],
        ['ratio'],
        ['number', 'numbers'],
        ['scaler'],
        ['position'],
        ['enum'],
        ['bool', 'boolean'],
        ['bco16'],
        ['mask'],
        ['flags'],
        ['string'],
        ['per radian'],
        ['per degree'],
    ];

    value: number;

    unit: string;

    constructor(value: number, unit: string) {
        const normalizedUnit = normalizeUnit(Miscellaneous.units, unit);
        this.value = value;
        this.unit = normalizedUnit ?? 'bool';
    }

    convertTo(_unit: string): number {
        return this.value;
    }
}
