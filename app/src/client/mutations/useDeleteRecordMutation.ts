import { useMutation } from 'react-query';
import { queryClient } from '../queryClient';
import { recordsQueryKeyBase } from '../queries/useRecordsQuery';
import { RecordService } from '../services/RecordService';

export interface DeleteRecordMutationProps {
    recordId: number;
}

export const deleteRecordMutation = async ({
    recordId,
}: DeleteRecordMutationProps) => {
    const result = await RecordService.delete(recordId);
    await queryClient.invalidateQueries(recordsQueryKeyBase);

    return result;
};

export const useDeleteRecordMutation = () => {
    return useMutation(deleteRecordMutation);
};
