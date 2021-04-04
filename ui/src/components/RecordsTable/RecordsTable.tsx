import { Table } from "antd";
import React from 'react';
import { LoadablePlaceholder } from "../LoadablePlaceholder";
import { useRecordsTableState } from "./useRecordsTableState";
import { Record } from '../../storage/models/Record';

export interface RecordsTableProps {
    onEdit?: (id: string) => void;
    onSelectionChanged?: (ids: string[], data: Record[]) => void;
    selectionType?: "radio" | "checkbox";
    month?: number;
    year?: number;
    typeId?: string;
}

export const RecordsTable = ({ onEdit, month, year, typeId, onSelectionChanged, selectionType }: RecordsTableProps) => {
    const { records, columns, isLoading, error } = useRecordsTableState({
        openEditor: onEdit,
        month,
        year,
        typeId,
    });

    if (error) return <span>RecordsTable: Error</span>;

    return (
            <LoadablePlaceholder isLoading={isLoading} isFailed={!!error} error={error} isEmpty={!records?.length}>
                <Table
                    dataSource={records}
                    columns={columns}
                    loading={isLoading}
                    pagination={false}
                    size='small'
                    rowKey={row => row.id!}
                    rowSelection={{
                        type: selectionType,
                        onChange: onSelectionChanged as any,
                    }}
                />
            </LoadablePlaceholder>
    )
};
