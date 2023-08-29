import {
    Box,
    Group,
    SegmentedControl,
    SegmentedControlItem,
    Text,
} from '@mantine/core';
import { memo, useMemo } from 'react';
import { Record } from '../client/models';
import { globalLabel } from '../global/labels';
import { TypeIcon } from './TypeIcon';

export interface RecordsFilterProps {
    value: string;
    records: ReadonlyArray<Record>;
    onChange: (value: string) => void;
}

export const RecordsFilter = memo(
    ({ value, onChange, records }: RecordsFilterProps) => {
        const filterOptions = useMemo(() => {
            const availableTypes: SegmentedControlItem[] = [
                {
                    label: (
                        <Text lineClamp={1} size='sm'>
                            {globalLabel.recordsView.allFilter}
                        </Text>
                    ),
                    value: 'all',
                },
            ];
            const availableTypesSet = new Set<string>();

            records.forEach((record) => {
                const typeName = record.type.name;
                if (!availableTypesSet.has(typeName)) {
                    availableTypesSet.add(typeName);
                    availableTypes.push({
                        label: (
                            <Group noWrap={true} spacing={5} align='center'>
                                <TypeIcon size={16} type={record.type} />
                                <Text lineClamp={1} size='sm'>
                                    {record.type.label}
                                </Text>
                            </Group>
                        ),
                        value: typeName,
                    });
                }
            });

            return availableTypes;
        }, [records]);

        return (
            <Box>
                <SegmentedControl
                    onChange={onChange}
                    value={value}
                    data={filterOptions}
                />
            </Box>
        );
    }
);

RecordsFilter.displayName = 'RecordsFilter';
