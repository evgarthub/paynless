import axios from 'axios';
import { NewRecord, Record, ResponseList } from '../models';
import { baseUrl } from './base';

class RecordService {
    private _baseUrl: string;

    constructor() {
        this._baseUrl = `${baseUrl}/records`;
    }

    public async get() {
        return await axios.get<ResponseList<Record>>(
            `${this._baseUrl}/?populate=type&sort[1]=date%3Adesc`
        );
    }

    public async getByTypeId(typeId: number) {
        return await axios.get<ResponseList<Record>>(
            `${this._baseUrl}/?populate=type&sort[1]=date%3Adesc&filters[type][id][$eq]=${typeId}`
        );
    }

    public async delete(id: number) {
        return await axios.delete(`${this._baseUrl}/${id}`);
    }

    public async create(record: NewRecord) {
        return await axios.post<Record>(this._baseUrl, record);
    }
}

const recordService = new RecordService();

export { recordService as RecordService };
