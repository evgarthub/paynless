import { BaseAttributes, Entity, ResponseItem } from './Response';

export interface NewTypeData {
    name: string;
    color: string;
    unit: string;
    label: string;
}

export interface TypeData extends BaseAttributes, NewTypeData {}

export interface Type extends Entity<TypeData> {}

export interface NewType extends ResponseItem<NewTypeData> {}
