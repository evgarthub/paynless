import { useQuery } from 'react-query';
import { TariffService } from '../services/TariffService';
import { Tariff } from '../models/Tariff';

export const tariffsQueryKey = 'tariffs';

export const tariffsQuery = async () => {
    const resp = await TariffService.get();

    return resp.data.data.map((t) => new Tariff(t));
};

export const useTariffsQuery = () => {
    return useQuery(tariffsQueryKey, tariffsQuery);
};
