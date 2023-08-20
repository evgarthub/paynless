import {
    Grid,
    Group,
    MediaQuery,
    ScrollArea,
    Stack,
    Text,
} from '@mantine/core';
import { memo } from 'react';
import { RecordsListItem } from './RecordsListItem';
import { Record } from '../../client/models';
import { globalLabel } from '../../global/labels';

export interface RecordsListProps {
    records: Record[];
}

export const RecordsList = memo(({ records }: RecordsListProps) => {
    return (
        <>
            <MediaQuery smallerThan='md' styles={{ display: 'none' }}>
                <Grid justify='space-between' align='center' pl='lg' pr='lg'>
                    <Grid.Col xs={12} sm={6} md={4}>
                        <Text color='gray'>
                            {globalLabel.recordsView.list.type}
                        </Text>
                    </Grid.Col>

                    <Grid.Col xs={12} sm={6} md={3}>
                        <Text color='gray'>
                            {globalLabel.recordsView.list.value}
                        </Text>
                    </Grid.Col>
                    <Grid.Col xs={12} sm={6} md={3}>
                        <Text color='gray'>
                            {globalLabel.recordsView.list.date}
                        </Text>
                    </Grid.Col>
                    <Grid.Col xs={12} sm={6} md={2}>
                        <Group position='right'>
                            <Text color='gray'>
                                {globalLabel.recordsView.list.actions}
                            </Text>
                        </Group>
                    </Grid.Col>
                </Grid>
            </MediaQuery>
            <ScrollArea>
                <Stack spacing='sm' p='lg' pt='xs'>
                    {records.map((r) => (
                        <RecordsListItem
                            key={r.id}
                            id={r.id}
                            type={r.attributes.type.data}
                            label={r.attributes.type.data.attributes.label}
                            value={r.attributes.value}
                            date={new Date(r.attributes.date)}
                            unit={r.attributes.type.data.attributes.unit}
                        />
                    ))}
                </Stack>
            </ScrollArea>
        </>
    );
});

RecordsList.displayName = 'RecordsList';
