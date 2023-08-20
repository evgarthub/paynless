import {
    Affix,
    Button,
    Group,
    Kbd,
    LoadingOverlay,
    Modal,
    NativeSelect,
    NumberInput,
    Stack,
    useMantineTheme,
} from '@mantine/core';
import { DatePicker, DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useHotkeys } from '@mantine/hooks';
import { showResponseErrorNotification } from '../utils/showResponseErrorNotification';
import { memo, useCallback, useMemo, useState } from 'react';
import { Apps, Calendar, Numbers } from 'tabler-icons-react';
import { NewRecord } from '../client/models';
import { useCreateRecordMutation } from '../client/mutations/useCreateRecordMutation';
import { useTypesQuery } from '../client/queries/useTypesQuery';
import { globalLabel } from '../global/labels';
import { AdvancedTooltip } from './AdvancedTooltip';
import { TypeSelectItemProps } from './TypeSelect';

interface FormState {
    type: string;
    date: Date;
    value: number;
}

export const CreateRecordModal = memo(() => {
    const { colors, colorScheme } = useMantineTheme();
    const [isOpened, setIsOpened] = useState(false);

    const { mutateAsync, isLoading: isCreationLoading } =
        useCreateRecordMutation();

    const { data: types, isLoading: isTypesLoading } = useTypesQuery();

    useHotkeys([
        [
            'mod+q',
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpened(true);
            },
        ],
    ]);

    const typesOptions = useMemo(() => {
        if (types) {
            return types.data.map<TypeSelectItemProps>((type) => ({
                value: String(type.id),
                label: type.attributes.label,
                data: type,
            }));
        }

        return [];
    }, [types]);

    const form = useForm<FormState>({
        initialValues: {
            type: `${typesOptions[0]?.data.id || 0}`,
            date: new Date(),
            value: 0,
        },

        validate: {
            value: (value: number) => {
                if (value < 0) return 'Value should be positive';
            },
            type: (value: string) => {
                if (!value) return 'Type is missing';
            },
        },
    });

    const handleClose = useCallback(() => {
        form.reset();
        setIsOpened(false);
    }, [form]);

    const handleOpen = useCallback(() => setIsOpened(true), []);

    const handleCreate = useCallback(async () => {
        const result = form.validate();

        const record: NewRecord = {
            data: {
                value: form.values.value,
                date: form.values.date,
                type: {
                    id: parseInt(form.values.type),
                },
            },
        };

        if (result.hasErrors) return;

        try {
            await mutateAsync({ record });
        } catch (error: any) {
            showResponseErrorNotification(
                globalLabel.createRecord.apiErrorTitle,
                error
            );
            return;
        }
        handleClose();
    }, [form, handleClose, mutateAsync]);

    return (
        <>
            <Affix position={{ bottom: 30, right: 30 }}>
                <AdvancedTooltip
                    tooltipContent={
                        <>
                            <Kbd>ctrl</Kbd> + <Kbd>Q</Kbd>
                        </>
                    }
                >
                    <Button
                        radius='xl'
                        size='xl'
                        onClick={handleOpen}
                        color='cyan'
                    >
                        {globalLabel.recordsView.create}
                    </Button>
                </AdvancedTooltip>
            </Affix>
            <Modal
                title={globalLabel.createRecord.title}
                closeOnClickOutside={false}
                opened={isOpened}
                onClose={handleClose}
                overlayProps={{
                    opacity: 0.55,
                    blur: 3,
                    color:
                        colorScheme === 'dark'
                            ? colors.dark[9]
                            : colors.gray[2],
                }}
            >
                <div style={{ position: 'relative' }}>
                    <LoadingOverlay
                        visible={isCreationLoading || isTypesLoading}
                    />
                    <Stack>
                        <NumberInput
                            label={globalLabel.createRecord.value}
                            icon={<Numbers />}
                            placeholder={
                                globalLabel.createRecord.valuePlaceholder
                            }
                            radius='lg'
                            size='md'
                            step={0.1}
                            precision={3}
                            {...form.getInputProps('value')}
                        />
                        <NativeSelect
                            data={typesOptions}
                            icon={<Apps />}
                            radius='lg'
                            size='md'
                            label={globalLabel.createRecord.type}
                            placeholder={
                                globalLabel.createRecord.typePlaceholder
                            }
                            {...form.getInputProps('type')}
                        />
                        <DatePickerInput
                            icon={<Calendar />}
                            radius='lg'
                            size='md'
                            label={globalLabel.createRecord.date}
                            placeholder={
                                globalLabel.createRecord.datePlaceholder
                            }
                            clearable={false}
                            {...form.getInputProps('date')}
                        />
                        <footer>
                            <Group position='right'>
                                <Button
                                    radius='xl'
                                    color='green'
                                    onClick={handleCreate}
                                >
                                    {globalLabel.createRecord.create}
                                </Button>
                                <Button
                                    radius='xl'
                                    variant='light'
                                    color='green'
                                    onClick={handleClose}
                                >
                                    {globalLabel.createRecord.cancel}
                                </Button>
                            </Group>
                        </footer>
                    </Stack>
                </div>
            </Modal>
        </>
    );
});

CreateRecordModal.displayName = 'CreateRecordModal';
