import { showNotification } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { ResponseItem } from '../client/models';

export const showResponseErrorNotification = (
    title: string,
    error: AxiosError<ResponseItem<unknown>>
) => {
    showNotification({
        title: 'Ми не змогли створити запис.',
        message: error.response?.data.error?.message,
        color: 'red',
    });
};
