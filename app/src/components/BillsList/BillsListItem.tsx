import { Title, Text, Paper, Stack, Group } from '@mantine/core';
import { format } from 'date-fns';
import { memo, useMemo } from 'react';
import { Bill } from '../../client/models/Bills';
import { globalLabel } from '../../global/labels';
import { Table } from '../Table';
import { getFormattedUtil } from './getFormattedUtil';

export interface BillsListItemProps {
    bill: Bill;
}

export const BillsListItem = memo(({ bill }: BillsListItemProps) => {
    const formattedData = useMemo(
        () => bill.attributes.utils.map(getFormattedUtil),
        [bill.attributes.utils]
    );

    return (
        <Paper shadow='md' radius='lg' p='md' withBorder={true}>
            <Stack>
                <Title order={3} pl='sm' pr='sm'>
                    {format(bill.attributes.payDate, 'MMMM')}{' '}
                    {format(bill.attributes.payDate, 'yyyy')}
                </Title>
                <Table
                    header={globalLabel.billsView.table}
                    rows={formattedData}
                />
                <Group position='apart' pl='sm' pr='sm'>
                    <Text transform='uppercase'>Всього:</Text>
                    <Text weight={700}>{bill.attributes.total} грн</Text>
                </Group>
            </Stack>
        </Paper>
    );
});
