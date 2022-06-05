import { useMutation } from 'react-query';
import { NewRecord } from '../models';
import { queryClient } from '../queryClient';
import { recordsQueryKey } from '../queries/useRecordsQuery';
import { RecordService } from '../services/RecordService';

export interface CreateRecordMutationProps {
    record: NewRecord;
}

export const createRecordMutation = async ({
    record,
}: CreateRecordMutationProps) => {
    const result = await RecordService.create(record);
    await queryClient.invalidateQueries(recordsQueryKey);

    return result;
};

export const useCreateRecordMutation = () => {
    return useMutation(createRecordMutation);
};
