import { Select } from '@mantine/core';
import {
    ComponentPropsWithoutRef,
    forwardRef,
    memo,
    useCallback,
    useMemo,
} from 'react';
import { RecordsListItem } from '../../RecordsList';
import { Record, Type } from '@client/models';
import { useRecordsQuery } from '@client/queries/useRecordsQuery';

interface SelectItemProps extends ComponentPropsWithoutRef<'div'> {
    record: Record;
    value: string;
}

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
    ({ record, value, ...divProps }: SelectItemProps, ref) => (
        <div {...divProps} ref={ref}>
            <RecordsListItem
                key={record.id}
                id={record.id}
                type={record.attributes.type.data}
                label={record.attributes.type.data.attributes.label}
                value={record.attributes.value}
                date={record.attributes.date}
                unit={record.attributes.type.data.attributes.unit}
                hideActions={true}
            />
        </div>
    )
);

export interface TypeSelectProps {
    type: Type;
    onChange: (selectedTypeId: number) => void;
}

export const TypeSelect = memo(({ type, onChange }: TypeSelectProps) => {
    const { data: recordsData } = useRecordsQuery({ typeId: type.id });

    const data = useMemo<SelectItemProps[]>(
        () =>
            recordsData?.data?.map((r) => ({
                record: r,
                label: `${r.attributes.value}`,
                value: `${r.id}`,
            })) || [],
        [recordsData]
    );

    const handleFilter = useCallback(
        (value: string, item: SelectItemProps) =>
            item.record.attributes.value
                .toString()
                .includes(value.toLowerCase().trim()) ||
            item.record.attributes.date
                .toISOString()
                .toLowerCase()
                .includes(value.toLowerCase().trim()),
        []
    );

    const handleChange = useCallback(
        (value: string) => {
            onChange(parseInt(value));
        },
        [onChange]
    );

    return (
        <Select
            data={data}
            filter={handleFilter}
            itemComponent={SelectItem}
            label='Choose employee of the month'
            maxDropdownHeight={400}
            nothingFound='Nobody here'
            placeholder='Pick one'
            searchable={true}
            withinPortal={true}
            zIndex={1001}
            onChange={handleChange}
        />
    );
});

TypeSelect.displayName = 'TypeSelect';
