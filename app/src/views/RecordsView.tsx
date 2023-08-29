import { memo, useMemo, useState } from 'react';
import { DeviceHeartMonitor } from 'tabler-icons-react';
import { useRecordsQuery } from '../client/queries/useRecordsQuery';

import {
    CreateRecordModal,
    RecordsList,
    RecordsFilter,
    MainContentLayout,
} from '../components';

import { globalLabel } from '../global/labels';

export const RecordsView = memo(() => {
    const { data, isError, isLoading } = useRecordsQuery();

    const [filter, setFilter] = useState<'all' | string>('all');

    const filteredRecords = useMemo(
        () =>
            data?.filter(
                (record) => filter === 'all' || record.type?.name === filter
            ) || [],
        [data, filter]
    );

    return (
        <MainContentLayout
            title={globalLabel.recordsView.title}
            description={globalLabel.recordsView.description}
            icon={DeviceHeartMonitor}
            isError={isError}
            isLoading={isLoading}
        >
            <RecordsFilter
                value={filter}
                onChange={setFilter}
                records={data || []}
            />
            <RecordsList records={filteredRecords} />
            <CreateRecordModal />
        </MainContentLayout>
    );
});

RecordsView.displayName = 'RecordsView';
