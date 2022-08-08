import { BaseAttributes, Entity, ResponseItem } from './Response';
import { Tariff } from './Tariff';
import { Type } from './Type';

export interface BillUtil {
    from: number;
    to: number;
    value: number;
    cost: number;
    name: string;
    type: ResponseItem<Type>;
    tariff: ResponseItem<Tariff>;
}

export interface NewBillData {
    payDate: Date;
    utils: BillUtil[];
    total: number;
}

export interface BillData extends BaseAttributes {
    payDate: Date;
    utils: BillUtil[];
    total: number;
}

export interface Bill extends Entity<BillData> {}

export interface NewBill extends ResponseItem<NewBillData> {}
