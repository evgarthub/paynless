import { useMutation, useQuery } from "@apollo/client";
import { useMemo } from "react";
import { DeleteBillProps, EditBillInput, BillData, BillsData, UpdateBillProps, BillConnectionMonthData, BillsGroupedMonth, CreateBillInput } from "./interface";
import { GET_BILLS_MONTH_GROUPED, CREATE_BILL, DELETE_BILL, GET_BILL, GET_BILLS, GET_BILLS_BY_TYPE_LIMIT, UPDATE_BILL } from "./query";

export const useGetBills = () => {
    const { data, loading, error, refetch } = useQuery<BillsData>(GET_BILLS);

    return {
        error,
        refetch,
        data: data?.bills,
        isLoading: loading,
        isFailed: !!error,
    }
}

export const useGetBillsByTypeLimit = (typeId: string, limit: number = 6) => {
    const { data, loading, error, refetch } = useQuery<BillsData>(GET_BILLS_BY_TYPE_LIMIT, { variables: { typeId, limit } });

    return {
        error,
        refetch,
        data: data?.bills,
        isLoading: loading,
        isFailed: !!error,
    };
}

export const useGetBill = (id?: string) => {
    const { data, loading, error, refetch } = useQuery<BillData>(GET_BILL, { variables: { id } });

    return {
        error,
        refetch,
        data: data?.bill,
        isLoading: loading,
        isFailed: !!error,
    };
}

export const useUpdateBill = () => {
    const [ updateBill ] = useMutation<UpdateBillProps>(UPDATE_BILL);

    const callback = (id: string, bill: EditBillInput) => {
        updateBill({ variables: { id, bill } });
    }

    return [ callback ];
}

export const useDeleteBill = () => {
    const [ deleteBill ] = useMutation<DeleteBillProps>(DELETE_BILL);

    const callback = async (id: string) => {
        await deleteBill({ variables: { id } });
    }

    return [ callback ];
};

export const useCreateBill = () => {
    const [ createBill ] = useMutation(CREATE_BILL);

    const callback = async (bill: CreateBillInput) => {
        await createBill({ variables: { bill } });
    };

    return [ callback ];
};

export const useGetBillsMonthGrouped = () => {
    const { data, loading, error, refetch } = useQuery<BillConnectionMonthData>(GET_BILLS_MONTH_GROUPED);

    const groupedBills: BillsGroupedMonth | undefined = useMemo(() => {
        return data?.billsConnection.groupBy.month.reduce((acc: BillsGroupedMonth, curr) => {
            const monthIndex = curr.connection.values[0].month;
            return {
                ...acc,
                [monthIndex]: curr.connection.values,
            };
        }, {});
    }, [data?.billsConnection.groupBy.month]);

    return {
        error,
        refetch,
        data: groupedBills,
        isLoading: loading,
        isFailed: !!error,
    };
}
