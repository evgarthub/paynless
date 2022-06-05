export interface BaseAttributes {
    createdAt: Date;
    updatedAt: Date;
}

export interface NewEntity<T> {
    attributes: T;
}

export interface Entity<T> extends NewEntity<T> {
    id: number;
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
}

export interface ResponseItem<T> {
    data: T;
}
