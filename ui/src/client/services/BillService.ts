import axios from 'axios';
import { ResponseList } from '../models';
import { Bill, NewBill } from '../models/Bills';
import { baseUrl } from './base';

class BillService {
    private _baseUrl: string;

    constructor() {
        this._baseUrl = `${baseUrl}/bills`;
    }

    public async get() {
        return await axios.get<ResponseList<Bill>>(
            `${this._baseUrl}/?populate=utils&populate=utils.type&populate=utils.tariff&sort[1]=payDate%3Adesc`
        );
    }

    public async delete(id: number) {
        return await axios.delete(`${this._baseUrl}/${id}`);
    }

    public async create(record: NewBill) {
        return await axios.post<Bill>(this._baseUrl, record);
    }
}

const billService = new BillService();

export { billService as BillService };
