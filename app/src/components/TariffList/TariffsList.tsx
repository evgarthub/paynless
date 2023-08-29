import {
    Group,
    Paper,
    Title,
    Stack,
    Badge,
    ScrollArea,
    Divider,
} from '@mantine/core';
import { memo, useMemo } from 'react';
import { Tariff } from '../../client/models/Tariff';
import { Type } from '../../client/models/Type';
import { TariffsListItem } from './TariffsListItem';

export interface TariffsListProps {
    tariffs: ReadonlyArray<Tariff>;
    types: ReadonlyArray<Type>;
}

export const TariffsList = memo(({ tariffs, types }: TariffsListProps) => {
    const pairs = useMemo(() => {
        return types.map((type) => {
            const _tariffs = tariffs.filter((t) => t.type?.id === type.id);

            return {
                title: type.label,
                name: type.name,
                color: type.color,
                unit: type.unit,
                list: _tariffs,
            };
        });
    }, [tariffs, types]);

    return (
        <ScrollArea>
            <Stack spacing='sm' p='lg' pt='xs'>
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
                        <Divider my='sm' />

                        {p.list.length ? (
                            <Stack spacing='xs'>
                                {p.list.map((t) => (
                                    <TariffsListItem
                                        key={t.id}
                                        tariff={t}
                                        unit={p.unit}
                                    />
                                ))}
                            </Stack>
                        ) : (
                            <span>$Пустий список</span>
                        )}
                    </Paper>
                ))}
            </Stack>
        </ScrollArea>
    );
});

TariffsList.displayName = 'TariffsList';
