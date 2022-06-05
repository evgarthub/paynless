import { Box, Stack, Title, Text } from '@mantine/core';
import { memo } from 'react';
import { CurrencyCent } from 'tabler-icons-react';
import { useTariffsQuery } from '../client/queries/useTariffsQuery';
import { useTypesQuery } from '../client/queries/useTypesQuery';
import { BusyLoader, TariffsList } from '../components';
import { globalLabel } from '../global/labels';

export const TariffsView = memo(() => {
    const {
        data: tariffsData,
        isLoading: isTariffsLoading,
        isError: isTariffsError,
    } = useTariffsQuery();
    const {
        data: typesData,
        isLoading: isTypesLoading,
        isError: isTypesError,
    } = useTypesQuery();

    return (
        <Box p='lg' sx={{ flexGrow: 1 }}>
            <Stack spacing='xs' mb='md'>
                <Title order={1}>
                    {globalLabel.tariffsView.title} <CurrencyCent />
                </Title>
                <Text color='gray'>{globalLabel.tariffsView.description}</Text>
            </Stack>
            <BusyLoader
                isError={isTariffsError || isTypesError}
                isLoading={isTariffsLoading || isTypesLoading}
            >
                {tariffsData?.data && typesData?.data && (
                    <TariffsList
                        tariffs={tariffsData.data}
                        types={typesData.data}
                    />
                )}
            </BusyLoader>
        </Box>
    );
});

TariffsView.displayName = 'TariffsView';
