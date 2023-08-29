import axios from 'axios';
import { NewRecord, RecordEntity, ResponseItem, ResponseList } from '../models';
import { baseUrl } from './base';

class RecordService {
    private _baseUrl: string;

    constructor() {
        this._baseUrl = `${baseUrl}/records`;
    }

    public async get(typeId?: number) {
        let query = '?populate=type&sort[1]=date%3Adesc';

        if (typeId) {
            query += `&filters[type][id][$eq]=${typeId}`;
        }
        return await axios.get<ResponseList<RecordEntity>>(
            `${this._baseUrl}/${query}`
        );
    }

    public async delete(id: number) {
        return await axios.delete(`${this._baseUrl}/${id}`);
    }

    public async create(record: NewRecord) {
        return await axios.post<ResponseItem<RecordEntity>>(
            this._baseUrl,
            record
        );
    }
}

const recordService = new RecordService();

export { recordService as RecordService };
