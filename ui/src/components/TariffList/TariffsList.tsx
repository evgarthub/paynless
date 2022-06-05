import { Group, Paper, Title, Stack, Badge } from '@mantine/core';
import { memo, useMemo } from 'react';
import { Tariff } from '../../client/models/Tariff';
import { Type } from '../../client/models/Type';
import { TariffsListItem } from './TariffsListItem';

export interface TariffsListProps {
    tariffs: Tariff[];
    types: Type[];
}

export const TariffsList = memo(({ tariffs, types }: TariffsListProps) => {
    const pairs = useMemo(() => {
        return types.map((type) => {
            const _tariffs = tariffs.filter(
                (t) => t.attributes.type.data.id === type.id
            );

            return {
                title: type.attributes.label,
                name: type.attributes.name,
                color: type.attributes.color,
                unit: type.attributes.unit,
                list: _tariffs,
            };
        });
    }, [tariffs, types]);

    return (
        <Stack spacing='md'>
            {pairs.map((p) => (
                <Paper
                    p='md'
                    radius='md'
                    key={p.name}
                    shadow='md'
                    withBorder={true}
                >
                    <Group spacing='xs'>
                        <Title order={4}>{p.title}</Title>
                        <Badge color={p.color} radius='md' variant='filled'>
                            {p.name}
                        </Badge>
                    </Group>
                    <Stack spacing='xs'>
                        {p.list.map((i) => (
                            <TariffsListItem
                                key={i.id}
                                tariff={i}
                                unit={p.unit}
                            />
                        ))}
                    </Stack>
                </Paper>
            ))}
        </Stack>
    );
});

TariffsList.displayName = 'TariffsList';
