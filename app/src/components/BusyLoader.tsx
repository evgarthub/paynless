import { Alert, Loader } from '@mantine/core';
import { memo, ReactNode } from 'react';
import { AlertCircle } from 'tabler-icons-react';
import { EmptySpace } from './EmptySpace';

export interface BusyLoaderProps {
    children: ReactNode;
    isLoading: boolean;
    isError: boolean;
    isEmpty?: boolean;
}

export const BusyLoader = memo(
    ({ children, isLoading, isError, isEmpty }: BusyLoaderProps) => {
        if (isError) {
            return (
                <Alert icon={<AlertCircle />} title='Bummer!' color='red'>
                    Something terrible happened!
                </Alert>
            );
        }

        if (isLoading) {
            return <Loader color='cyan' variant='bars' />;
        }

        if (isEmpty) {
            return <EmptySpace />;
        }

        return <>{children}</>;
    }
);

BusyLoader.displayName = 'BusyLoader';
