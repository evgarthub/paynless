import axios from 'axios';
import { BillEntity, NewBill } from '../models/Bills';
import { baseUrl } from './base';
import { ResponseItem, ResponseList } from '@client/models';

class BillService {
    private _baseUrl: string;

    constructor() {
        this._baseUrl = `${baseUrl}/bills`;
    }

    public async get() {
        return await axios.get<ResponseList<BillEntity>>(
            `${this._baseUrl}/?populate=utils&populate=utils.type&populate=utils.tariff&populate=utils.tariff.limits&populate=utils.recordFrom&populate=utils.recordTo&sort[1]=payDate%3Adesc`
        );
    }

    public async delete(id: number) {
        return await axios.delete(`${this._baseUrl}/${id}`);
    }

    public async create(record: NewBill) {
        return await axios.post<ResponseItem<BillEntity>>(
            this._baseUrl,
            record
        );
    }
}

const billService = new BillService();

export { billService as BillService };
