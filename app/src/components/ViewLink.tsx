import {
    Group,
    ThemeIcon,
    UnstyledButton,
    Text,
    DefaultMantineColor,
} from '@mantine/core';
import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'tabler-icons-react';

export interface ViewLinkProps {
    color: DefaultMantineColor;
    icon: Icon;
    label: string;
    path: string;
}

export const ViewLink = memo(
    ({ icon: Icon, label, color, path }: ViewLinkProps) => {
        const navigate = useNavigate();

        const handleNavigate = useCallback(() => {
            navigate(path);
        }, [navigate, path]);

        return (
            <UnstyledButton
                sx={(theme) => ({
                    display: 'block',
                    width: '100%',
                    padding: theme.spacing.xs,
                    borderRadius: theme.radius.sm,
                    color:
                        theme.colorScheme === 'dark'
                            ? theme.colors.dark[0]
                            : theme.black,

                    '&:hover': {
                        backgroundColor:
                            theme.colorScheme === 'dark'
                                ? theme.colors.dark[6]
                                : theme.colors.gray[0],
                    },
                })}
                onClick={handleNavigate}
            >
                <Group>
                    <ThemeIcon color={color} variant='light'>
                        <Icon />
                    </ThemeIcon>
                    <Text size='sm'>{label}</Text>
                </Group>
            </UnstyledButton>
        );
    }
);

ViewLink.displayName = 'ViewLink';
