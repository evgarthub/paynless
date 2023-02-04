import { useMutation } from 'react-query';
import { queryClient } from '../queryClient';
import { typesQueryKey } from '../queries/useTypesQuery';
import { TypeService } from '../services/TypeService';

export interface DeleteTypeMutationProps {
    typeId: number;
}

export const deleteTypeMutation = async ({
    typeId,
}: DeleteTypeMutationProps) => {
    const result = await TypeService.delete(typeId);
    await queryClient.invalidateQueries(typesQueryKey);

    return result;
};

export const useDeleteTypeMutation = () => {
    return useMutation(deleteTypeMutation);
};
