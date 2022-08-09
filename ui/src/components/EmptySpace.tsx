import { Center, Group, Text, Title } from '@mantine/core';
import { memo } from 'react';
import { Ballon } from 'tabler-icons-react';

export const EmptySpace = memo(() => {
    return (
        <Center style={{ flexGrow: 1 }}>
            <Group>
                <Ballon size={50} />
                <div>
                    <Title order={3}>Ну що ж..</Title>
                    <Text>Тут поки що нічого нема, але зате ти перший!</Text>
                </div>
            </Group>
        </Center>
    );
});
