import { useQuery } from 'react-query';
import { BillService } from '../services/BillService';
import { Bill } from '../models/Bills';

export const billsQueryKey = 'bills';

export const billsQuery = async () => {
    const resp = await BillService.get();

    return resp.data.data.map((b) => new Bill(b));
};

export const useBillsQuery = () => {
    return useQuery(billsQueryKey, billsQuery);
};
