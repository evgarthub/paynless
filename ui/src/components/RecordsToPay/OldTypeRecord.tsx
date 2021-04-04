import { Checkbox, Tag } from "antd";
import moment, { Moment } from "moment";
import React, { memo, useMemo } from "react";
import { ListLayout } from "../../layout";
import { useGetBillsByTypeLimit } from "../../storage/models/Bill";
import { useGetRecordsByDateRangeForType } from "../../storage/models/Record";
import { Type } from "../../storage/models/Type";
import { MinusOutlined } from '@ant-design/icons';

export interface RecordsToPayProps {
    type: Type;
    isChecked: boolean;
    onChange: (id: string) => void;
    tillDate: Moment;
}

export const TypeRecord = memo(({ type, isChecked, onChange, tillDate }: RecordsToPayProps) => {
    const { data: bills } = useGetBillsByTypeLimit(type.id, 1);
    const fromDateFormated = (bills?.[0]?.date ? moment(bills?.[0]?.date) : moment().subtract(1, 'month'));
    const tillDateFormated = tillDate.endOf('month');
    const { data: records } = useGetRecordsByDateRangeForType(type.id, [fromDateFormated, tillDateFormated]);

    const record = useMemo(() => records?.[0], [records]);

    const handleChange = () => onChange(type.id);

    return (
        <ListLayout gap={15}>
            <ListLayout direction='row' gap={10}>
                <Checkbox checked={isChecked} onChange={handleChange}>
                    <Tag color={type?.color} title={type?.uid}>{type?.label}</Tag>
                </Checkbox>
            </ListLayout>
            {record ? 
                <ListLayout gap={10}>
                    <div>{record?.value} {record?.type?.unit}</div>
                    <div>{record?.date}</div>
                </ListLayout>
                : <MinusOutlined />
            }
        </ListLayout>
    )
});