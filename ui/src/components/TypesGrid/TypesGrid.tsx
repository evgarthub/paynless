import { Box } from '@mantine/core';
import { memo } from 'react';
import { Type } from '../../client/models/Type';
import { TypesGridItem } from './TypesGridItem';

export interface TypesGridProps {
    types: Type[];
}

export const TypesGrid = memo(({ types }: TypesGridProps) => {
    return (
        <Box
            sx={() => ({
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gridGap: 10,
            })}
        >
            {types.map((t) => (
                <TypesGridItem
                    key={t.attributes.name}
                    title={t.attributes.label}
                    name={t.attributes.name}
                    unit={t.attributes.unit}
                    color={t.attributes.color}
                    id={t.id}
                />
            ))}
        </Box>
    );
});

TypesGrid.displayName = 'TypesGrid';
