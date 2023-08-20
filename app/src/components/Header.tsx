import { ActionIcon, Group, Title, useMantineColorScheme } from '@mantine/core';
import { memo } from 'react';
import { Bandage, MoonStars, Sun } from 'tabler-icons-react';

export const Header = memo(() => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();

    return (
        <Group position='apart'>
            <Group spacing='xs'>
                <Bandage size={36} />
                <Title order={3}>Pay'n'less</Title>
            </Group>
            <ActionIcon
                variant='default'
                onClick={() => toggleColorScheme()}
                size={30}
            >
                {colorScheme === 'dark' ? (
                    <Sun size={16} />
                ) : (
                    <MoonStars size={16} />
                )}
            </ActionIcon>
        </Group>
    );
});

Header.displayName = 'Header';
