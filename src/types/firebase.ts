export interface Auto {
    door: boolean;
    fan: boolean;
    light: boolean;
}

export interface Devices {
    light: boolean;
    fan: boolean;
    door: boolean;
    laser: boolean;
    refill_food: boolean;
    refill_water: boolean;
}

export interface Environment {
    drink: number;
    food: number;
    temperature: number;
    humidity: number;
}
export interface Data {
    auto : Auto;
    devices : Devices;
    environment : Environment;
}
export type AutoKeys = keyof Auto;
export type EnvKeys = keyof Environment;
export type DeviceKeys = keyof Devices;
