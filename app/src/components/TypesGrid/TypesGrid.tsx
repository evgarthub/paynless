import { Box } from '@mantine/core';
import { memo } from 'react';
import { Type } from '@client/models';
import { TypesGridItem } from './TypesGridItem';

export interface TypesGridProps {
    types: ReadonlyArray<Type>;
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
                    key={t.name}
                    title={t.label}
                    name={t.name}
                    unit={t.unit}
                    color={t.color}
                    id={t.id}
                />
            ))}
        </Box>
    );
});

TypesGrid.displayName = 'TypesGrid';
