import { ScrollArea, Stack } from '@mantine/core';
import { memo } from 'react';
import { Bill } from '../../client/models/Bills';
import { BillsListItem } from './BillsListItem';

export interface BillsListProps {
    bills: Bill[];
}

export const BillsList = memo(({ bills }: BillsListProps) => {
    return (
        <ScrollArea>
            <Stack justify='flex-start' spacing='sm' p='lg' pt='xs'>
                {bills.map((b) => (
                    <BillsListItem key={b.id} bill={b} />
                ))}
            </Stack>
        </ScrollArea>
    );
});
