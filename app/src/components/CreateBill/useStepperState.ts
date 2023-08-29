import { useState } from 'react';

export const useStepperState = () => {
    const [activeStep, setActiveStep] = useState(0);

    const nextStep = () =>
        setActiveStep((current) => (current < 2 ? current + 1 : current));
    const previousStep = () =>
        setActiveStep((current) => (current > 0 ? current - 1 : current));

    return {
        activeStep,
        setActiveStep,
        nextStep,
        previousStep,
    };
};
