import {
    Badge,
    MantineColor,
    Paper,
    SimpleGrid,
    Title,
    Text,
} from '@mantine/core';
import { memo } from 'react';
import { globalLabel } from '../../global/labels';

export interface TypesGridItemProps {
    color: MantineColor;
    title: string;
    name: string;
    unit: string;
}

export const TypesGridItem = memo(
    ({ color, title, name, unit }: TypesGridItemProps) => {
        return (
            <Paper
                shadow='md'
                radius='lg'
                p='lg'
                withBorder={true}
                sx={{ minWidth: 280 }}
            >
                <Title order={3} mb='md'>
                    {title}
                </Title>
                <SimpleGrid cols={2}>
                    <Text weight={500}>
                        {globalLabel.typesView.typeItem.name}
                    </Text>
                    <Text>{name}</Text>
                    <Text weight={500}>{globalLabel.unit}</Text>
                    <Text>{unit}</Text>
                    <Text weight={500}>
                        {globalLabel.typesView.typeItem.color}
                    </Text>
                    <Badge color={color} radius='md' variant='filled'>
                        {color}
                    </Badge>
                </SimpleGrid>
            </Paper>
        );
    }
);

TypesGridItem.displayName = 'TypesGridItem';
