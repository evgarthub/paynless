import {
    Affix,
    Button,
    Kbd,
    LoadingOverlay,
    Modal,
    Stack,
    Stepper,
    useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { memo, useCallback, useMemo } from 'react';
import { useTypesQuery } from '@client/queries/useTypesQuery';
import { globalLabel } from '@global/labels';
import { AdvancedTooltip } from '../AdvancedTooltip';
import { TypeSelectItemProps } from '../TypeSelect';
import { useCreateBillMutation } from '@client/mutations/useCreateBillMutation';
import { useStepperState } from './useStepperState';
import { RecordsStep } from './RecordsStep/RecordsStep';
import { ModalFooter } from './ModalFooter';
import { TypesStep } from './TypesStep';
import { Record } from '@client/models';

const { steps, title, createButton } = globalLabel.createBill;

interface FormState {
    utils: number[];
    period: Date;
    records: {
        [type: number]: [Record, Record];
    };
}

export const CreateBillModal = memo(() => {
    const { colors, colorScheme } = useMantineTheme();
    const [isOpened, handleModal] = useDisclosure(false);
    const { activeStep, setActiveStep, nextStep, previousStep } =
        useStepperState();

    const { mutateAsync: createBillAsync, isLoading: isCreationLoading } =
        useCreateBillMutation();

    const { data: typesData, isLoading: isTypesLoading } = useTypesQuery();

    useHotkeys([
        [
            'mod+q',
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                handleModal.open();
            },
        ],
    ]);

    const typesOptions = useMemo(() => {
        if (typesData) {
            return typesData.data.map<TypeSelectItemProps>((type) => ({
                value: String(type.id),
                label: type.attributes.label,
                data: type,
            }));
        }

        return [];
    }, [typesData]);

    const form = useForm<FormState>({
        initialValues: {
            utils: [],
            period: new Date(),
        },

        validate: {
            utils: (value: number[]) => {
                if (value.length === 0)
                    return 'Add at least 1 utility to pay for';
            },
            // Check valid date
        },
    });

    const selectedTypes = useMemo(
        () =>
            typesData?.data.filter((t) =>
                form.values.utils.find((id) => id == t.id)
            ),
        [form.values.utils, typesData?.data]
    );

    const handleClose = useCallback(() => {
        form.reset();
        setActiveStep(0);
        handleModal.close();
    }, [form, handleModal, setActiveStep]);

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
                        onClick={handleModal.open}
                        color='cyan'
                    >
                        {createButton}
                    </Button>
                </AdvancedTooltip>
            </Affix>
            <Modal
                title={title}
                closeOnClickOutside={false}
                opened={isOpened}
                onClose={handleClose}
                size='xl'
                mih={600}
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
                        <Stepper
                            active={activeStep}
                            onStepClick={setActiveStep}
                            breakpoint='sm'
                        >
                            <Stepper.Step label={steps.types.title}>
                                <TypesStep
                                    typeOptions={typesOptions}
                                    inputProps={form.getInputProps('utils')}
                                />
                            </Stepper.Step>

                            <Stepper.Step label={steps.records.title}>
                                {selectedTypes && (
                                    <RecordsStep
                                        types={selectedTypes}
                                        onChange={form.getInputProps('')}
                                    />
                                )}
                            </Stepper.Step>

                            <Stepper.Step title={steps.confirmation.title}>
                                Підтвердження
                            </Stepper.Step>
                        </Stepper>

                        <ModalFooter
                            currentStep={activeStep}
                            nextStep={nextStep}
                            onClose={handleClose}
                            prevStep={previousStep}
                        />
                    </Stack>
                </div>
            </Modal>
        </>
    );
});

CreateBillModal.displayName = 'CreateBillModal';

const calculateTotal = (utils: any[]) => {
    // let result = 0;

    utils.forEach((u) => console.log(u));
    console.log('Function not implemented.');
};
