import { ScrollArea, Stack } from '@mantine/core';
import { memo } from 'react';
import { Bill } from '@client/models/Bills';
import { BillCard } from '../BillCard';

export interface BillsListProps {
    bills: Bill[];
}

export const BillsList = memo(({ bills }: BillsListProps) => {
    return (
        <ScrollArea>
            <Stack justify='flex-start' spacing='sm' p='lg' pt='xs'>
                {bills.map((b) => (
                    <BillCard
                        key={b.id}
                        payDate={b.payDate}
                        total={b.total}
                        utils={b.utils}
                    />
                ))}
            </Stack>
        </ScrollArea>
    );
});

BillsList.displayName = 'BillsList';
