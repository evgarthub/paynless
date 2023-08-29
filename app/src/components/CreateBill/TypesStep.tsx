import { Type } from '@client/models';
import { Checkbox, SelectItem, Stack } from '@mantine/core';
import { memo } from 'react';

export interface TypeOption extends SelectItem {
    value: string;
    label: string;
    data: Type;
}

export interface TypesStepProps {
    typeOptions: TypeOption[];
    inputProps: {
        value: any;
        onChange: any;
        checked?: any;
        error?: any;
        onFocus?: any;
        onBlur?: any;
    };
}

export const TypesStep = memo(({ typeOptions, inputProps }: TypesStepProps) => {
    return (
        <Checkbox.Group {...inputProps}>
            <Stack spacing='xs'>
                {typeOptions.map((o) => (
                    <Checkbox key={o.value} value={o.value} label={o.label} />
                ))}
            </Stack>
        </Checkbox.Group>
    );
});

TypesStep.displayName = 'TypesStep';
