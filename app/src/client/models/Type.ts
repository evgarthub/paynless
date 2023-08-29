import {
    BaseAttributes,
    BackendEntity,
    ResponseItem,
    Entity,
} from './Response';

export interface NewTypeData {
    name: string;
    color: string;
    unit: string;
    label: string;
}

export interface TypeData extends BaseAttributes, NewTypeData {}

export type TypeEntity = BackendEntity<TypeData>;

export type NewType = ResponseItem<NewTypeData>;

export class Type extends Entity {
    private _typeAttributes: NewTypeData;

    constructor(backendEntity: TypeEntity) {
        super(backendEntity);
        this._typeAttributes = backendEntity.attributes;
    }

    public get color(): string {
        return this._typeAttributes.color;
    }

    public get label(): string {
        return this._typeAttributes.label;
    }

    public get name(): string {
        return this._typeAttributes.name;
    }

    public get unit(): string {
        return this._typeAttributes.unit;
    }
}
