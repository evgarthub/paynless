import axios from 'axios';
import { ResponseList } from '../models';
import { NewType, TypeEntity } from '../models/Type';
import { baseUrl } from './base';

class TypeService {
    private _baseUrl: string;

    constructor() {
        this._baseUrl = `${baseUrl}/types`;
    }

    public async get() {
        return await axios.get<ResponseList<TypeEntity>>(`${this._baseUrl}/`);
    }

    public async delete(id: number) {
        return await axios.delete(`${this._baseUrl}/${id}`);
    }

    public async create(record: NewType) {
        return await axios.post<TypeEntity>(this._baseUrl, record);
    }
}

const typeService = new TypeService();

export { typeService as TypeService };
