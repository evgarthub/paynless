import { Button, Stack } from '@mantine/core';
import { memo } from 'react';
import { Lock } from 'tabler-icons-react';

export const LoginPage = memo(() => {
    return (
        <Stack>
            <Button
                onClick={() => {
                    window.location.href =
                        'http://localhost:1337/api/connect/google';
                }}
                rightIcon={<Lock />}
            >
                Увійти з Google
            </Button>
        </Stack>
    );
});
