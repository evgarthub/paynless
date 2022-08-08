import { Stack, Title, Text } from '@mantine/core';
import { memo } from 'react';
import { CurrencyDollar } from 'tabler-icons-react';
import { useBillsQuery } from '../client/queries/useBillsQuery';
import { BusyLoader } from '../components';
import { BillsList } from '../components/BillsList';
import { globalLabel } from '../global/labels';

export const BillsView = memo(() => {
    const { data, isError, isLoading } = useBillsQuery();

    return (
        <Stack p='lg' sx={{ flexGrow: 1 }}>
            <Stack spacing='xs' mb='md'>
                <Title order={1}>
                    {globalLabel.billsView.title} <CurrencyDollar />
                </Title>
                <Text color='gray'>{globalLabel.billsView.description}</Text>
            </Stack>
            <BusyLoader isError={isError} isLoading={isLoading}>
                {data?.data && <BillsList bills={data.data} />}
            </BusyLoader>
        </Stack>
    );
});
