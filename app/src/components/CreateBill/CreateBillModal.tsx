import {
    LoadingOverlay,
    Modal,
    Stack,
    Stepper,
    useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { memo, useCallback, useMemo } from 'react';
import { useTypesQuery } from '@client/queries/useTypesQuery';
import { globalLabel } from '@global/labels';
import { TypeSelectItemProps } from '../TypeSelect';
import { useCreateBillMutation } from '@client/mutations/useCreateBillMutation';
import { useStepperState } from './useStepperState';
import { RecordsStep } from './RecordsStep/RecordsStep';
import { ModalFooter } from './ModalFooter';
import { TypesStep } from './TypesStep';
import { Record, Type } from '@client/models';
import { BillCard } from '@components/BillCard';
import { ResultStep } from './ResultStep';

const { steps, title } = globalLabel.createBill;

interface FormState {
    types: number[];
    period: Date;
    records: {
        [type: number]: [Record, Record];
    };
}

export interface CreateBillModalProps {
    isOpened: boolean;
    onOpen: () => void;
    onClose: () => void;
}

export const CreateBillModal = memo(
    ({ onClose, isOpened }: CreateBillModalProps) => {
        const { colors, colorScheme } = useMantineTheme();
        const { activeStep, setActiveStep, nextStep, previousStep } =
            useStepperState();

        const { mutateAsync: createBillAsync, isLoading: isCreationLoading } =
            useCreateBillMutation();

        const { data: typesData, isLoading: isTypesLoading } = useTypesQuery();

        const typesOptions = useMemo(() => {
            if (typesData) {
                return typesData.map<TypeSelectItemProps>((type) => ({
                    value: String(type.id),
                    label: type.label,
                    data: type,
                }));
            }

            return [];
        }, [typesData]);

        const form = useForm<FormState>({
            initialValues: {
                types: [],
                period: new Date(),
                records: [],
            },

            validate: {
                types: (value: number[]) => {
                    if (value.length === 0)
                        return 'Додайте як мінімум 1 послугу для оплати';
                },
                // Check valid date
            },
        });

        const selectedTypes = useMemo(
            () =>
                typesData?.filter((t) =>
                    form.values.types.find((id) => id == t.id)
                ),
            [form.values.types, typesData]
        );

        const handleClose = useCallback(() => {
            form.reset();
            setActiveStep(0);
            onClose();
        }, [onClose, form, setActiveStep]);

        return (
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
                                        onChange={
                                            form.getInputProps('records')
                                                .onChange
                                        }
                                    />
                                )}
                            </Stepper.Step>

                            <Stepper.Step title={steps.confirmation.title}>
                                {selectedTypes && (
                                    <ResultStep
                                        period={form.values.period}
                                        types={selectedTypes}
                                        records={form.values.records}
                                    />
                                )}
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
        );
    }
);

CreateBillModal.displayName = 'CreateBillModal';
