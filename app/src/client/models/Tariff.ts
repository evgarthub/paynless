import { BaseAttributes, Entity, ResponseItem } from './Response';
import { Type } from './Type';

export interface TariffDataBaseFields {
    cost: number;
    isAbsolute: boolean;
    limit: number;
    source: string;
    startDate: Date;
    isEnabled: boolean;
}

export interface NewTariffData extends TariffDataBaseFields {
    type: Omit<Type, 'attributes'>;
}

export interface TariffData extends BaseAttributes, TariffDataBaseFields {
    type: ResponseItem<Type>;
}

export interface Tariff extends Entity<TariffData> {}

export interface NewTariff extends ResponseItem<NewTariffData> {}
