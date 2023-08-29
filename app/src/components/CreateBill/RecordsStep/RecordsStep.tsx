import { Type } from '@client/models';
import { TypeSelect } from './TypeSelect';
import { memo } from 'react';
import { Stack } from '@mantine/core';

export interface RecordsStepProps {
    types: ReadonlyArray<Type>;
    onChange: (recordId: number) => void;
}

export const RecordsStep = memo(({ types, onChange }: RecordsStepProps) => {
    return (
        <Stack spacing='md'>
            {types.map((t) => (
                <TypeSelect key={t.id} type={t} onChange={onChange} />
            ))}
        </Stack>
    );
});

RecordsStep.displayName = 'RecordsStep';
