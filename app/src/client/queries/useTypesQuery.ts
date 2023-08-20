import { useQuery } from 'react-query';
import { TypeService } from '../services/TypeService';

export const typesQueryKey = 'types';

export const typesQuery = async () => {
    return await (
        await TypeService.get()
    ).data;
};

export const useTypesQuery = () => {
    return useQuery(typesQueryKey, typesQuery);
};
