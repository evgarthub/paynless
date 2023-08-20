import { Badge, DefaultMantineColor } from '@mantine/core';
import { forwardRef, memo, Ref } from 'react';

export interface SelectColorItemProps {
    value: DefaultMantineColor;
}

export const SelectColorItem = memo(
    forwardRef(
        (
            { value, ...props }: SelectColorItemProps,
            handleRef: Ref<HTMLLIElement>
        ) => {
            return (
                <li {...props} ref={handleRef} style={{ listStyle: 'none' }}>
                    <Badge color={value} variant='filled'>
                        {value}
                    </Badge>
                </li>
            );
        }
    )
);

SelectColorItem.displayName = 'SelectColorItem';
