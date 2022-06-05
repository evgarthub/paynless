import { useQuery } from 'react-query';
import { TariffService } from '../services/TariffService';

export const tariffsQueryKey = 'tariffs';

export const tariffsQuery = async () => {
    const resp = await TariffService.get();

    resp.data.data = resp.data.data.map((t) => {
        t.attributes.startDate = new Date(t.attributes.startDate);
        t.attributes.createdAt = new Date(t.attributes.createdAt);
        t.attributes.updatedAt = new Date(t.attributes.updatedAt);

        return t;
    });
    return resp.data;
};

export const useTariffsQuery = () => {
    return useQuery(tariffsQueryKey, tariffsQuery);
};
