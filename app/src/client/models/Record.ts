import {
    BaseAttributes,
    BackendEntity,
    ResponseItem,
    Entity,
} from './Response';
import { Type, TypeEntity } from './Type';

export interface NewRecordData {
    value: number;
    date: string;
    type: Omit<TypeEntity, 'attributes'>;
}

export interface RecordData extends BaseAttributes {
    value: number;
    date: string;
    type?: ResponseItem<TypeEntity>;
}

export type RecordEntity = BackendEntity<RecordData>;

export type NewRecord = ResponseItem<NewRecordData>;

export class Record extends Entity {
    private _date: Date;
    private _type: Type | undefined;
    private _value: number;

    constructor(backendEntity: RecordEntity) {
        super(backendEntity);
        this._date = new Date(backendEntity.attributes.date);
        this._type = backendEntity.attributes.type
            ? new Type(backendEntity.attributes.type.data)
            : undefined;
        this._value = backendEntity.attributes.value;
    }

    public get date(): Date {
        return this._date;
    }

    public get type(): Type | undefined {
        return this._type;
    }

    public get value(): number {
        return this._value;
    }
}
