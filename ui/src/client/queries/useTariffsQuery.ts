import { useQuery } from 'react-query';
import { mapBaseAttributes } from '../models';
import { TariffService } from '../services/TariffService';

export const tariffsQueryKey = 'tariffs';

export const tariffsQuery = async () => {
    const resp = await TariffService.get();

    resp.data.data = resp.data.data.map((t) => {
        t.attributes.startDate = new Date(t.attributes.startDate);
        mapBaseAttributes(t.attributes);

        return t;
    });
    return resp.data;
};

export const useTariffsQuery = () => {
    return useQuery(tariffsQueryKey, tariffsQuery);
};
