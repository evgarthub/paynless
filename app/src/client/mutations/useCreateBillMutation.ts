import { useMutation } from 'react-query';
import { NewBill } from '../models/Bills';
import { BillService } from '../services/BillService';
import { queryClient } from '../queryClient';
import { billsQueryKey } from '../queries/useBillsQuery';

export interface CreateBillMutationProps {
    bill: NewBill;
}

const createBillMutation = async ({ bill }: CreateBillMutationProps) => {
    const result = await BillService.create(bill);
    await queryClient.invalidateQueries(billsQueryKey);

    return result;
};

export const useCreateBillMutation = () => {
    return useMutation(createBillMutation);
};
