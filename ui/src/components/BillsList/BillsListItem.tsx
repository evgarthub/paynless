import { Title, Text, Paper, Stack, Group } from '@mantine/core';
import { format } from 'date-fns';
import { memo, useMemo } from 'react';
import { Bill } from '../../client/models/Bills';
import { Table } from '../Table';

export interface BillsListItemProps {
    bill: Bill;
}

const billsHeader = {
    name: 'Послуга',
    range: 'Показання',
    value: 'Витрачено',
    tariff: 'Тариф',
    cost: 'Вартість',
};

export const BillsListItem = memo(({ bill }: BillsListItemProps) => {
    const formattedData = useMemo(
        () =>
            bill.attributes.utils.map((util) => {
                const unit = util.type.data.attributes.unit;
                const name = util.type.data.attributes.label;
                const range = `${util.from} → ${util.to} ${unit}`;
                const value = util.to - util.from;
                const tariff = `${util.tariff.data.attributes.cost} грн/${unit}`;
                const cost = `${util.cost} грн`;

                return {
                    name,
                    range,
                    value,
                    tariff,
                    cost,
                };
            }),
        [bill.attributes.utils]
    );

    return (
        <Paper shadow='md' radius='lg' p='md'>
            <Stack>
                <Title order={3} pl='sm' pr='sm'>
                    {format(bill.attributes.payDate, 'MMMM')}{' '}
                    {format(bill.attributes.payDate, 'yyyy')}
                </Title>
                <Table header={billsHeader} rows={formattedData} />
                <Group position='apart' pl='sm' pr='sm'>
                    <Text transform='uppercase'>Всього:</Text>
                    <Text weight={700}>{bill.attributes.total} грн</Text>
                </Group>
            </Stack>
        </Paper>
    );
});
