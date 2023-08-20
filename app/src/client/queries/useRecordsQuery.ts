import { UseQueryOptions, useQuery } from 'react-query';
import { Record, ResponseList, mapBaseAttributes } from '../models';
import { RecordService } from '../services/RecordService';

export interface RecordsQueryParams {
    typeId?: number;
}

export const recordsQueryKeyBase = 'records';

export const getRecordsQueryKey = (params: RecordsQueryParams | undefined) => [
    recordsQueryKeyBase,
    params?.typeId,
];

export const recordsQuery = async ({ typeId }: RecordsQueryParams) => {
    let response;

    if (typeId !== undefined) {
        response = await RecordService.getByTypeId(typeId);
    } else {
        response = await RecordService.get();
    }

    // Convert string date field to Date type
    response.data.data = response.data.data.map((r) => {
        r.attributes.date = new Date(r.attributes.date);
        mapBaseAttributes(r.attributes);
        return r;
    });

    return response.data;
};

export const useRecordsQuery = (params?: RecordsQueryParams, options?: UseQueryOptions<ResponseList<Record>>) => {
    return useQuery(getRecordsQueryKey(params), () =>
        recordsQuery(params || {}), options
    );
};
