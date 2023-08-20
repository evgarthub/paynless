import { BaseAttributes, Entity, ResponseItem } from './Response';
import { Type } from './Type';

export interface NewRecordData {
    value: number;
    date: Date;
    type: Omit<Type, 'attributes'>;
}

export interface RecordData extends BaseAttributes {
    value: number;
    date: Date;
    type: ResponseItem<Type>;
}

export interface Record extends Entity<RecordData> {}

export interface NewRecord extends ResponseItem<NewRecordData> {}
