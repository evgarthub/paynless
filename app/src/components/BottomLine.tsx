import { Box } from '@mantine/core';
import { memo, ReactNode } from 'react';

export interface BottomLineProps {
    children: ReactNode;
}

export const BottomLine = memo(({ children }: BottomLineProps) => (
    <Box
        sx={({ colorScheme, colors, spacing }) => ({
            flexGrow: 1,
            paddingBottom: spacing.lg,
            borderBottom: `1px solid ${
                colorScheme === 'dark' ? colors.dark[4] : colors.gray[2]
            }`,
        })}
    >
        {children}
    </Box>
));

BottomLine.displayName = 'BottomLine';
