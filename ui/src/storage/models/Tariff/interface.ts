import { EMPTY_TYPE, Type } from "../Type";

export interface Tariff extends NewTariff {
    id: string,
}

export interface NewTariff {
    source?: string;
    startDate: string;
    isAbsolute: boolean;
    costs: Cost[];
    type: Partial<Type>;
}

export interface TariffsData {
    tariffs: Tariff[];
} 

export interface TariffData {
    tariff: Tariff;
} 

export const EMPTY_TARIFF: NewTariff = {
    source: '',
    startDate: '',
    isAbsolute: false,
    costs: [],
    type: EMPTY_TYPE,
}

export interface Cost {
    cost: number;
    limit?: number;
}