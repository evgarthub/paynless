import moment from "moment";
import { Type } from "../Type";

export interface Record extends NewRecord {
    id?: string;
}

export interface NewRecord {
    value: number;
    date: string;
    type?: Type;
}

export interface RecordsData {
    records: Record[];
}

export interface RecordData {
    record: Record;
}

export interface EditRecordInput {
    value: number;
    date: string;
    type: string;
}

export interface UpdateRecordProps {
    id: string;
    record: EditRecordInput;
}

export interface DeleteRecordProps {
    id: string;
}

export const EMPTY_RECORD: NewRecord = {
    value: 0,
    date: moment().toISOString(),
    type: {
        label: '',
        unit: '',
        uid: '',
        id: ''
    }
}