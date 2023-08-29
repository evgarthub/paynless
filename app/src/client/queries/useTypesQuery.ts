import { useQuery } from 'react-query';
import { TypeService } from '../services/TypeService';
import { Type } from '../models/Type';

export const typesQueryKey = 'types';

export const typesQuery = async (): Promise<ReadonlyArray<Type>> => {
    const list = await TypeService.get();
    return list.data.data.map((t) => new Type(t));
};

export const useTypesQuery = () => {
    return useQuery(typesQueryKey, typesQuery);
};
