import { useMutation } from 'react-query';
import { NewRecord } from '../models';
import { queryClient } from '../queryClient';
import { recordsQueryKeyBase } from '../queries/useRecordsQuery';
import { RecordService } from '../services/RecordService';

export interface CreateRecordMutationProps {
    record: NewRecord;
}

export const createRecordMutation = async ({
    record,
}: CreateRecordMutationProps) => {
    const result = await RecordService.create(record);
    await queryClient.invalidateQueries(recordsQueryKeyBase);

    return result;
};

export const useCreateRecordMutation = () => {
    return useMutation(createRecordMutation);
};
