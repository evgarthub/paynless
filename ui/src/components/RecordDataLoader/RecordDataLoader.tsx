import React, { memo, ReactElement, useMemo } from "react";
import { EMPTY_RECORD, Record, useGetRecord } from "../../storage/models/Record";
import { LoadablePlaceholder } from "../LoadablePlaceholder";


export interface RecordDataLoaderProps {
    id?: string;
    children: (record: Record) => ReactElement;
}

const RecordDataLoader = ({ id, children }: RecordDataLoaderProps) => {
    const { data, isLoading, isFailed } = useGetRecord(id);

    const record: Record = useMemo(() => {
        if (id && data) return data;

        return EMPTY_RECORD;
    }, [data, id]);

    return (
        <LoadablePlaceholder isLoading={isLoading} isFailed={isFailed} isEmpty={!record}>
            {children(record)}
        </LoadablePlaceholder>
    );
}

const c = memo(RecordDataLoader);
export { c as RecordDataLoader };