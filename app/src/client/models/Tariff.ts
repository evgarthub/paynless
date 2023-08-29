import {
    BaseAttributes,
    BackendEntity,
    ResponseItem,
    Entity,
} from './Response';
import { Type, TypeEntity } from './Type';

export interface TariffLimit {
    cost: number;
    limit: number | undefined;
}

export interface TariffDataBaseFields {
    isAbsolute: boolean;
    limits: {
        cost: number;
        limit: number | null;
    }[];
    source: string;
    startDate: string;
    isEnabled: boolean;
}

export interface NewTariffData extends TariffDataBaseFields {
    type: Omit<TypeEntity, 'attributes'>;
}

export interface TariffData extends BaseAttributes, TariffDataBaseFields {
    type?: ResponseItem<TypeEntity>;
}

export type TariffEntity = BackendEntity<TariffData>;

export type NewTariff = ResponseItem<NewTariffData>;

export class Tariff extends Entity {
    private _startDate: Date;
    private _type: Type | undefined;
    private _tariffAttributes: TariffDataBaseFields;
    private _limits: TariffLimit[];

    constructor(backendEntity: TariffEntity) {
        super(backendEntity);
        this._tariffAttributes = backendEntity.attributes;
        this._startDate = new Date(backendEntity.attributes.startDate);
        this._type = backendEntity.attributes.type
            ? new Type(backendEntity.attributes.type.data)
            : undefined;
        this._limits = backendEntity.attributes.limits.map((l) => ({
            cost: l.cost,
            limit: l.limit === null ? undefined : l.limit,
        }));
    }

    public get isAbsolute(): boolean {
        return this._tariffAttributes.isAbsolute;
    }

    public get limits(): TariffLimit[] {
        return this._limits;
    }

    public get source(): string {
        return this._tariffAttributes.source;
    }

    public get startDate(): Date {
        return this._startDate;
    }

    public get type(): Type | undefined {
        return this._type;
    }

    public get isEnabled(): boolean {
        return this._tariffAttributes.isEnabled;
    }
}
