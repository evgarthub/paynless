import { Title, Text, Paper, Stack, Group } from '@mantine/core';
import { format } from 'date-fns';
import { memo } from 'react';
import { BillUtil } from '@client/models/Bills';
import { BillsTable } from '@components/BillsTable';

export interface BillProps {
    payDate: Date;
    total: number;
    utils: ReadonlyArray<BillUtil>;
}

export const BillCard = memo(({ payDate, total, utils }: BillProps) => {
    return (
        <Paper shadow='md' radius='lg' p='md' withBorder={true}>
            <Stack>
                <Title order={3} pl='sm' pr='sm'>
                    {`${format(payDate, 'MMMM')} ${format(payDate, 'yyyy')}`}
                </Title>
                <BillsTable utils={utils} />
                <Group position='apart' pl='sm' pr='sm'>
                    <Text transform='uppercase'>Всього:</Text>
                    <Text weight={700}>{total} грн</Text>
                </Group>
            </Stack>
        </Paper>
    );
});

BillCard.displayName = 'BillCard';
