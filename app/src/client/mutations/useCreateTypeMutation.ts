import { useMutation } from 'react-query';
import { NewType } from '../models';
import { queryClient } from '../queryClient';
import { TypeService } from '../services/TypeService';
import { typesQueryKey } from '../queries/useTypesQuery';

export interface CreateTypeMutationProps {
    type: NewType;
}

export const createTypeMutation = async ({ type }: CreateTypeMutationProps) => {
    const result = await TypeService.create(type);
    await queryClient.invalidateQueries(typesQueryKey);

    return result;
};

export const useCreateTypeMutation = () => {
    return useMutation(createTypeMutation);
};
