import { Box, Stack, Title, Text } from '@mantine/core';
import { memo } from 'react';
import { ColorSwatch } from 'tabler-icons-react';
import { useTypesQuery } from '../client/queries/useTypesQuery';
import { BusyLoader, TypesGrid } from '../components';
import { globalLabel } from '../global/labels';

export const TypesView = memo(() => {
    const { data, isLoading, isError } = useTypesQuery();

    return (
        <Box p='lg' sx={{ flexGrow: 1 }}>
            <Stack spacing='xs' mb='md'>
                <Title order={1}>
                    {globalLabel.typesView.title} <ColorSwatch />
                </Title>
                <Text color='gray'>{globalLabel.typesView.description}</Text>
            </Stack>
            <BusyLoader isError={isError} isLoading={isLoading}>
                {data?.data && <TypesGrid types={data?.data} />}
            </BusyLoader>
        </Box>
    );
});

TypesView.displayName = 'TypesView';
