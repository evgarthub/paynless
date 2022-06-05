import { BaseAttributes, Entity } from './Response';

export interface TypeData extends BaseAttributes {
    name: string;
    color: string;
    unit: string;
    label: string;
}

export interface Type extends Entity<TypeData> {}

export type NewType = Omit<Type, 'id'>;
