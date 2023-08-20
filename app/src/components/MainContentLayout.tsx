import { memo, ReactNode } from 'react';
import { Stack, Title, Text } from '@mantine/core';
import { BusyLoader } from './BusyLoader';
import { Icon } from 'tabler-icons-react';

export interface MainContentLayoutProps {
    title: string;
    description: string;
    icon: Icon;
    isError?: boolean;
    isLoading?: boolean;
    children: ReactNode;
}

export const MainContentLayout = memo(
    ({
        title,
        description,
        icon: Icon,
        isError = false,
        isLoading = false,
        children,
    }: MainContentLayoutProps) => {
        return (
            <Stack p='lg' sx={{ flexGrow: 1 }}>
                <Stack spacing='xs' mb='sm'>
                    <Title order={1}>
                        {title} <Icon />
                    </Title>
                    <Text color='gray'>{description}</Text>
                </Stack>
                <BusyLoader isError={isError} isLoading={isLoading}>
                    {children}
                </BusyLoader>
            </Stack>
        );
    }
);

MainContentLayout.displayName = 'MainContentLayout';
