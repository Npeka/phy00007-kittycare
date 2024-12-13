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

export type DeviceKeys = keyof Devices;
