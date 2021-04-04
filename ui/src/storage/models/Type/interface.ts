export interface Type extends NewType {
    id: string,
}

export interface NewType {
    uid: string;
    label: string;
    unit: string;
    color?: string;
}

export interface TypesData {
    types: Type[];
} 

export interface TypeData {
    type: Type;
} 

export const EMPTY_TYPE: NewType = {
    uid: '',
    label: '',
    unit: '',
    color: '',
}