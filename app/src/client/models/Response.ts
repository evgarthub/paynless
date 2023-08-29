export interface BaseAttributes {
    createdAt: Date;
    updatedAt: Date;
}

export const mapBaseAttributes = <T extends BaseAttributes>(data: T) => {
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
};

export interface NewEntity<T> {
    attributes: T;
}

export interface BackendEntity<T> extends NewEntity<T> {
    id: number;
}

export interface StrapiError {
    status: string;
    name: string;
    message: string;
    details: string;
}

export interface ResponseList<T> {
    data: T[];
    meta: {
        pagination: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
    error?: StrapiError;
}

export interface ResponseItem<T> {
    data: T;
    error?: StrapiError;
}

export class Entity {
    private _id: number;
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(backendEntity: BackendEntity<BaseAttributes>) {
        this._id = backendEntity.id;
        this._createdAt = new Date(backendEntity.attributes.createdAt);
        this._updatedAt = new Date(backendEntity.attributes.updatedAt);
    }

    public get id(): number {
        return this._id;
    }

    public get createdAt(): Date {
        return this._createdAt;
    }

    public get updatedAt(): Date {
        return this._updatedAt;
    }
}
