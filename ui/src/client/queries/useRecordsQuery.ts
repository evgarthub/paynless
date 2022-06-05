import { useQuery } from 'react-query';
import { RecordService } from '../services/RecordService';

export const recordsQueryKey = 'records';

export const recordsQuery = async () => {
    const resp = await RecordService.get();

    // Convert string date field to Date type
    resp.data.data = resp.data.data.map((r) => {
        r.attributes.date = new Date(r.attributes.date);
        return r;
    });

    return resp.data;
};

export const useRecordsQuery = () => {
    return useQuery(recordsQueryKey, recordsQuery);
};
