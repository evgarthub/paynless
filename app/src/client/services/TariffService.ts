import axios from 'axios';
import { ResponseList } from '../models';
import { NewTariff, TariffEntity } from '../models/Tariff';
import { baseUrl } from './base';

class TariffService {
    private _baseUrl: string;

    constructor() {
        this._baseUrl = `${baseUrl}/tariffs`;
    }

    public async get() {
        return await axios.get<ResponseList<TariffEntity>>(
            `${this._baseUrl}/?populate=type&populate=limits&sort[1]=startDate%3Adesc`
        );
    }

    public async delete(id: number) {
        return await axios.delete(`${this._baseUrl}/${id}`);
    }

    public async create(tariff: NewTariff) {
        return await axios.post<TariffEntity>(this._baseUrl, tariff);
    }
}

const tariffService = new TariffService();

export { tariffService as TariffService };
