import { ColumnsType } from 'antd/lib/table';
import { DeleteFilled, EditOutlined } from '@ant-design/icons';
import { ListLayout } from '../../layout';
import { Tag, Button, Popconfirm } from "antd";
import { Type } from "../../storage/models/Type/";
import { useCallback, useMemo } from "react";
import { useDeleteRecord, Record, useGetRecordsByDateRangeForType, } from "../../storage/models/Record";
import React from 'react';
import moment from 'moment';

export interface RecordsTableStateHookProps {
    openEditor?: (id: string) => void;
    month?: number;
    year?: number;
    typeId?: string;
}

export const useRecordsTableState = ({ openEditor, month, year, typeId }: RecordsTableStateHookProps) => {
    const customDate = useMemo(() => {
        if (year || month) {
            const date = moment();

            if (year) date.year(year);
            if (month) date.month(month);

            return date;
        }
    }, [month, year]);

    const { data, isLoading, isFailed, error } = useGetRecordsByDateRangeForType(typeId, [customDate?.startOf('month'), customDate?.endOf('month')]);
    const [deleteRecord] = useDeleteRecord();    

    const handleDelete = useCallback((id: string) => {
        deleteRecord(id);
    }, [deleteRecord]);

    const columns: ColumnsType<Record> = useMemo(() => {
        const mandatoryCols: ColumnsType<Record> = [
            {
                title: 'Услуга',
                dataIndex: 'type',
                key: 'date',
                render: ({ color, uid, label }: Type) => <Tag color={color} title={uid}>{label}</Tag>,
            },
            {
                title: 'Показатель',
                dataIndex: 'value',
                key: 'value',
                render: (value: number, record: Record) => `${value} ${record.type?.unit}`,
            },
            {
                title: 'Дата',
                dataIndex: 'date',
                key: 'date',
            },
        ];

        if (openEditor) mandatoryCols.push(
            {
                title: 'Действия',
                dataIndex: 'id',
                key: 'actions',
                render: (id: string) => (
                    <ListLayout gap={10} direction="row" hAlignment="flex-start" key={id}>
                        <Button icon={<EditOutlined />} onClick={() => openEditor(id)}>Редактировать</Button>
                        <Popconfirm
                            title="Вы точно хотите удалить эту запись?"
                            onConfirm={() => handleDelete(id)}
                            okText="Удалить"
                            cancelText="Отменить"
                        >
                            <Button icon={<DeleteFilled />}>Удалить</Button>
                        </Popconfirm>
                    </ListLayout>
                ),
            }
        );

        return mandatoryCols;
    }, [handleDelete, openEditor]);

    return {
        isLoading,
        isFailed,
        columns,
        error,
        records: data,
    }
};