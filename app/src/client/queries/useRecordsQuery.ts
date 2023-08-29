import { QueryKey, UseQueryOptions, useQuery } from 'react-query';
import { Record } from '../models';
import { RecordService } from '../services/RecordService';

export interface RecordsQueryParams {
    typeId?: number;
}

export const recordsQueryKeyBase = 'records';

export const getRecordsQueryKey = (
    params: RecordsQueryParams | undefined
): QueryKey => [recordsQueryKeyBase, params?.typeId];

export const recordsQuery = async ({ typeId }: RecordsQueryParams) => {
    const response = await RecordService.get(typeId);

    return response.data.data.map((r) => new Record(r));
};

export const useRecordsQuery = (
    params?: RecordsQueryParams,
    options?: UseQueryOptions<ReadonlyArray<Record>>
) => {
    return useQuery(
        getRecordsQueryKey(params),
        () => recordsQuery(params || {}),
        options
    );
};
