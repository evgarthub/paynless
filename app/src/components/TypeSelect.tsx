import {
    Avatar,
    Group,
    Select,
    SelectItem,
    SelectProps,
    Text,
} from '@mantine/core';
import { memo } from 'react';
import { Apps } from 'tabler-icons-react';
import { Type } from '../client/models/Type';
import { getUtilityTypeIcon } from '../utils/utilityType';

export interface TypeSelectItemProps extends SelectItem {
    value: string;
    label: string;
    data: Type;
}

const TypeSelectItem = memo(({ label, value, data }: TypeSelectItemProps) => {
    const TypeIcon = getUtilityTypeIcon(data.name);

    return (
        <Group noWrap={true}>
            <Avatar color={data.color} radius='xl'>
                <TypeIcon />
            </Avatar>
            <Text weight={500}>{label}</Text>
        </Group>
    );
});

TypeSelectItem.displayName = 'TypeSelectItem';

export interface TypeSelectProps extends SelectProps {
    data: TypeSelectItemProps[];
}

export const TypeSelect = memo(({ data, ...rest }: TypeSelectProps) => {
    return (
        <Select
            {...rest}
            icon={<Apps />}
            radius='lg'
            size='md'
            label='Select utility type'
            placeholder='Pick one'
            itemComponent={TypeSelectItem}
            data={data}
            maxDropdownHeight={400}
        />
    );
});

TypeSelect.displayName = 'TypeSelect';
