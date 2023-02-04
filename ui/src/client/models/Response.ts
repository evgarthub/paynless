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

export interface Entity<T> extends NewEntity<T> {
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
