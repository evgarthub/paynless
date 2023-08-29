import { Record, RecordEntity } from './Record';
import {
    BaseAttributes,
    BackendEntity,
    ResponseItem,
    Entity,
} from './Response';
import { Tariff, TariffEntity } from './Tariff';
import { Type, TypeEntity } from './Type';

export interface BackendBillUtil {
    value: number;
    cost: number;
    name: string;
    type: ResponseItem<TypeEntity>;
    tariff: ResponseItem<TariffEntity>;
    recordFrom: ResponseItem<RecordEntity>;
    recordTo: ResponseItem<RecordEntity>;
    id: number;
}

export interface NewBillData {
    payDate: Date;
    utils: BackendBillUtil[];
    total: number;
}

export interface BillData extends BaseAttributes {
    payDate: Date;
    utils: BackendBillUtil[];
    total: number;
}

export type BillEntity = BackendEntity<BillData>;

export type NewBill = ResponseItem<NewBillData>;

export interface BillUtil {
    value: number;
    cost: number;
    name: string;
    type: Type;
    tariff: Tariff;
    recordFrom: Omit<Record, 'type'>;
    recordTo: Omit<Record, 'type'>;
    id?: number;
}

export class Bill extends Entity {
    private _billData: BillData;
    private _utils: ReadonlyArray<BillUtil>;

    constructor(response: BillEntity) {
        super(response);
        this._billData = response.attributes;
        this._utils = response.attributes.utils.map((u) => {
            return {
                cost: u.cost,
                name: u.name,
                recordFrom: new Record(u.recordFrom.data),
                recordTo: new Record(u.recordTo.data),
                tariff: new Tariff(u.tariff.data),
                type: new Type(u.type.data),
                value: u.value,
                id: u.id,
            };
        });
    }

    public get payDate(): Date {
        return new Date(this._billData.payDate);
    }

    public get total(): number {
        return this._billData.total;
    }

    public get utils(): ReadonlyArray<BillUtil> {
        return this._utils;
    }
}
