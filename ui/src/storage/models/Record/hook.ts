import { useMutation, useQuery } from "@apollo/client";
import { Moment } from "moment";
import { momentDateFormat } from "../../../utils/momentDateFormat";
import { DeleteRecordProps, EditRecordInput, RecordData, RecordsData, UpdateRecordProps } from "./interface";
import { CREATE_RECORD, DELETE_RECORD, GET_RECORD, GET_RECORDS, GET_RECORDS_BY_RANGE, GET_RECORDS_BY_RANGE_FOR_TYPE, UPDATE_RECORD } from "./query";

export const useGetRecords = () => {
    const { data, loading, error, refetch } = useQuery<RecordsData>(GET_RECORDS);

    return {
        error,
        refetch,
        data: data?.records,
        isLoading: loading,
        isFailed: !!error,
    };
}

export const useGetRecordsByDateRange = (from?: Moment, till?: Moment) => {
    const { data, loading, error, refetch } = useQuery<RecordsData>(GET_RECORDS_BY_RANGE, { variables: { from: from && momentDateFormat(from), till: till && momentDateFormat(till) } });

    return {
        error,
        refetch,
        data: data?.records,
        isLoading: loading,
        isFailed: !!error,
    };
}

export const useGetRecordsByDateRangeForType = (typeId?: string, dateRange?: [(Moment | undefined), (Moment | undefined)]) => {
    const from = dateRange?.[0] && momentDateFormat(dateRange[0]);
    const till = dateRange?.[1] && momentDateFormat(dateRange[1]);
    const { data, loading, error, refetch } = useQuery<RecordsData>(GET_RECORDS_BY_RANGE_FOR_TYPE, { variables: { typeId, from, till } });

    return {
        error,
        refetch,
        data: data?.records,
        isLoading: loading,
        isFailed: !!error,
    };
}

export const useGetRecord = (id?: string) => {
    const { data, loading, error, refetch } = useQuery<RecordData>(GET_RECORD, { variables: { id }, skip: !id},);

    return {
        error,
        refetch,
        data: data?.record,
        isLoading: loading,
        isFailed: !!error,
    };
}


export const useUpdateRecord = () => {
    const [ updateRecord ] = useMutation<UpdateRecordProps>(UPDATE_RECORD, {
        refetchQueries: [{ query: GET_RECORDS }]
    });

    const callback = (id: string, record: EditRecordInput) => {
        updateRecord({ variables: { id, record } });
    }

    return [ callback ];
}

export const useDeleteRecord = () => {
    const [ deleteRecord ] = useMutation<DeleteRecordProps>(DELETE_RECORD, {
        refetchQueries: [{ query: GET_RECORDS }]
    });

    const callback = (id: string) => {
        deleteRecord({ variables: { id } });
    }

    return [ callback ];
}

export const useCreateRecord = () => {
    const [ createRecord ] = useMutation(CREATE_RECORD, {
        refetchQueries: [{ query: GET_RECORDS }]
    });

    const callback = (record: EditRecordInput) => {
        createRecord({ variables: { record } });
    }

    return [ callback ];
}
