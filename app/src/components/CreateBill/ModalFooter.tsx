import { globalLabel } from '@global/labels';
import { Button, Group } from '@mantine/core';
import { memo } from 'react';

export interface ModalFooterProps {
    currentStep: number;
    nextStep: () => void;
    prevStep: () => void;
    onClose: () => void;
}

export const ModalFooter = memo(
    ({ currentStep, nextStep, prevStep, onClose }: ModalFooterProps) => {
        return (
            <footer>
                <Group position='right'>
                    <Button
                        disabled={currentStep === 0}
                        radius='xl'
                        variant='light'
                        color='green'
                        onClick={prevStep}
                    >
                        Назад
                    </Button>

                    {currentStep !== 2 ? (
                        <Button
                            disabled={currentStep === 2}
                            radius='xl'
                            color='green'
                            onClick={nextStep}
                        >
                            Далі
                        </Button>
                    ) : (
                        <Button radius='xl' color='green'>
                            {globalLabel.createRecord.create}
                        </Button>
                    )}
                    <Button
                        radius='xl'
                        variant='light'
                        color='red'
                        onClick={onClose}
                    >
                        {globalLabel.createRecord.cancel}
                    </Button>
                </Group>
            </footer>
        );
    }
);

ModalFooter.displayName = 'ModalFooter';
