import {
    Affix,
    Button,
    Group,
    Kbd,
    LoadingOverlay,
    Modal,
    Select,
    Stack,
    TextInput,
    useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useHotkeys } from '@mantine/hooks';
import { memo, useCallback, useState } from 'react';
import { Palette } from 'tabler-icons-react';
import { NewType, NewTypeData } from '../../client/models';
import { useCreateTypeMutation } from '../../client/mutations/useCreateTypeMutation';
import { defaultMantineColors } from '../../global/colors';
import { globalLabel } from '../../global/labels';
import { AdvancedTooltip } from '../AdvancedTooltip';
import { SelectColorItem } from './SelectColorItem';
import { showResponseErrorNotification } from '../../utils/showResponseErrorNotification';

export const CreateTypeModal = memo(() => {
    const { colors, colorScheme } = useMantineTheme();
    const [isOpened, setIsOpened] = useState(false);

    const { mutateAsync, isLoading: isCreationLoading } =
        useCreateTypeMutation();

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

    const form = useForm<NewTypeData>({
        initialValues: {
            color: defaultMantineColors[0],
            label: '',
            name: '',
            unit: '',
        },

        validate: {
            color: (value: string) => {
                if (!value) return 'Додай фарб';
            },
            label: (value: string) => {
                if (!value) return 'Не залишай пустим';
            },
            name: (value: string) => {
                if (!/[a-zA-Z]{3,}[0-9]*/gm.test(value))
                    return 'Унікальний ідентифікатор, латиниця від 3ох символів';
            },
            unit: (value: string) => {
                if (!value) return 'Не залишай пустим';
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

        const type: NewType = {
            data: {
                color: form.values.color,
                label: form.values.label,
                name: form.values.name,
                unit: form.values.unit,
            },
        };

        if (result.hasErrors) return;

        try {
            await mutateAsync({ type });
        } catch (error: any) {
            showResponseErrorNotification(
                globalLabel.createType.apiErrorTitle,
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
                        {globalLabel.typesView.create}
                    </Button>
                </AdvancedTooltip>
            </Affix>
            <Modal
                title={globalLabel.createType.title}
                closeOnClickOutside={false}
                opened={isOpened}
                onClose={handleClose}
                overlayOpacity={0.55}
                overlayBlur={3}
                overlayColor={
                    colorScheme === 'dark' ? colors.dark[9] : colors.gray[2]
                }
            >
                <div style={{ position: 'relative' }}>
                    <LoadingOverlay visible={isCreationLoading} />
                    <Stack>
                        <TextInput
                            label={globalLabel.createType.label}
                            placeholder={
                                globalLabel.createType.labelPlaceholder
                            }
                            radius='lg'
                            size='md'
                            {...form.getInputProps('label')}
                        />
                        <TextInput
                            label={globalLabel.createType.unit}
                            placeholder={globalLabel.createType.unitPlaceholder}
                            radius='lg'
                            size='md'
                            {...form.getInputProps('unit')}
                        />
                        <TextInput
                            label={globalLabel.createType.name}
                            placeholder={globalLabel.createType.namePlaceholder}
                            radius='lg'
                            size='md'
                            {...form.getInputProps('name')}
                        />
                        <Select
                            label={globalLabel.createType.color}
                            placeholder={
                                globalLabel.createType.colorPlaceholder
                            }
                            itemComponent={SelectColorItem}
                            data={defaultMantineColors as string[]}
                            icon={<Palette />}
                            radius='lg'
                            size='md'
                            searchable
                            maxDropdownHeight={400}
                            nothingFound={globalLabel.createType.colorEmpty}
                            filter={(value, item) =>
                                item.value
                                    .toLowerCase()
                                    .includes(value.toLowerCase().trim())
                            }
                            {...form.getInputProps('color')}
                        />
                        <footer>
                            <Group position='right'>
                                <Button
                                    radius='xl'
                                    color='green'
                                    onClick={handleCreate}
                                >
                                    {globalLabel.createType.create}
                                </Button>
                                <Button
                                    radius='xl'
                                    variant='light'
                                    color='green'
                                    onClick={handleClose}
                                >
                                    {globalLabel.createType.cancel}
                                </Button>
                            </Group>
                        </footer>
                    </Stack>
                </div>
            </Modal>
        </>
    );
});

CreateTypeModal.displayName = 'CreateTypeModal';
