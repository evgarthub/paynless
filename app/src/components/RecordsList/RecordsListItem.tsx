import {
    Avatar,
    Grid,
    Group,
    LoadingOverlay,
    Paper,
    Text,
    useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { format } from 'date-fns';
import { memo, useCallback } from 'react';
import { Trash } from 'tabler-icons-react';
import { Type } from '@client/models/Type';
import { useDeleteRecordMutation } from '@client/mutations/useDeleteRecordMutation';
import { dateFormat } from '@global/date';
import { globalLabel } from '@global/labels';
import { getUtilityTypeIcon } from '../../utils/utilityType';
import { ActionIconConfirm } from '../ActionIconConfirm';

export interface RecordsListItemProps {
    date: Date;
    label: string;
    type: Type;
    unit: string;
    value: number;
    id: number;
    hideActions?: boolean;
}

export const RecordsListItem = memo(
    ({
        type,
        label,
        value,
        date,
        unit,
        id,
        hideActions,
    }: RecordsListItemProps) => {
        const { mutateAsync, isLoading } = useDeleteRecordMutation();
        const { breakpoints, colorScheme } = useMantineTheme();
        const matchesMaxMd = useMediaQuery(`(max-width: ${breakpoints.md}px)`);
        const matchesMinSm = useMediaQuery(`(min-width: ${breakpoints.sm}px)`);

        const TypeIcon = getUtilityTypeIcon(type.name);

        const handleDelete = useCallback(async () => {
            await mutateAsync({ recordId: id });
        }, [id, mutateAsync]);

        return (
            <Paper
                shadow='sm'
                radius='lg'
                p='lg'
                withBorder={true}
                style={{ position: 'relative' }}
            >
                <LoadingOverlay visible={isLoading} />
                <Grid justify='space-between' align='center'>
                    <Grid.Col xs={12} sm={6} md={4}>
                        <Group>
                            <Avatar color={type.color} radius='xl'>
                                <TypeIcon />
                            </Avatar>
                            <Text weight={500}>{label}</Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col xs={12} sm={6} md={3}>
                        <Group
                            spacing={5}
                            position={
                                matchesMinSm && matchesMaxMd ? 'right' : 'left'
                            }
                        >
                            <Text
                                c={colorScheme === 'light' ? 'gray' : 'gray0'}
                                size='lg'
                            >
                                {value}
                            </Text>
                            <Text
                                c={colorScheme === 'light' ? 'gray' : 'gray3'}
                                size='sm'
                            >
                                {unit}
                            </Text>
                        </Group>
                    </Grid.Col>
                    <Grid.Col xs={12} sm={6} md={3}>
                        <Text c={colorScheme === 'light' ? 'gray' : 'gray0'}>
                            {format(date, dateFormat)}
                        </Text>
                    </Grid.Col>
                    {!hideActions && (
                        <Grid.Col xs={12} sm={6} md={2}>
                            <Group position='right'>
                                <ActionIconConfirm
                                    color='red'
                                    confirmMessage={
                                        globalLabel.recordsView.list
                                            .deleteConfirmMessage
                                    }
                                    icon={Trash}
                                    onClick={handleDelete}
                                    position='left'
                                    tooltip={
                                        globalLabel.recordsView.list
                                            .deleteTooltip
                                    }
                                />
                            </Group>
                        </Grid.Col>
                    )}
                </Grid>
            </Paper>
        );
    }
);

RecordsListItem.displayName = 'RecordsListItem';
