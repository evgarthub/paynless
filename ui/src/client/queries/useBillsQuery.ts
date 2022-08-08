import { useQuery } from 'react-query';
import { mapBaseAttributes } from '../models';
import { BillService } from '../services/BillService';

export const billsQueryKey = 'bills';

export const billsQuery = async () => {
    const resp = await BillService.get();

    // Convert string date field to Date type
    resp.data.data = resp.data.data.map((b) => {
        b.attributes.payDate = new Date(b.attributes.payDate);
        mapBaseAttributes(b.attributes);

        b.attributes.utils.forEach((u) => {
            u.tariff.data.attributes.startDate = new Date(
                u.tariff.data.attributes.startDate
            );
            mapBaseAttributes(u.tariff.data.attributes);
            mapBaseAttributes(u.type.data.attributes);
        });

        return b;
    });

    return resp.data;
};

export const useBillsQuery = () => {
    return useQuery(billsQueryKey, billsQuery);
};
