import { Stack, Title, Text } from '@mantine/core';
import { memo, useMemo, useState } from 'react';
import { DeviceHeartMonitor } from 'tabler-icons-react';
import { useRecordsQuery } from '../client/queries/useRecordsQuery';

import {
    BusyLoader,
    CreateRecordModal,
    RecordsList,
    RecordsFilter,
} from '../components';

import { globalLabel } from '../global/labels';

export const RecordsView = memo(() => {
    const { data, isError, isLoading } = useRecordsQuery();

    const [filter, setFilter] = useState<'all' | string>('all');

    const filteredRecords = useMemo(
        () =>
            data?.data.filter(
                (record) =>
                    filter === 'all' ||
                    record.attributes.type.data.attributes.name === filter
            ) || [],
        [data?.data, filter]
    );

    return (
        <Stack p='lg' sx={{ flexGrow: 1 }}>
            <Stack spacing='xs' mb='md'>
                <Title order={1}>
                    {globalLabel.recordsView.title} <DeviceHeartMonitor />
                </Title>
                <Text color='gray'>{globalLabel.recordsView.description}</Text>
            </Stack>
            <BusyLoader isError={isError} isLoading={isLoading}>
                <RecordsFilter
                    value={filter}
                    onChange={setFilter}
                    records={data?.data || []}
                />
                <RecordsList records={filteredRecords} />
            </BusyLoader>
            <CreateRecordModal />
        </Stack>
    );
});

RecordsView.displayName = 'RecordsView';
