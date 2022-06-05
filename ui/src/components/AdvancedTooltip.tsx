import { Popover } from '@mantine/core';
import { memo, ReactNode, useCallback, useState } from 'react';

export interface AdvancedTooltipProps {
    tooltipContent: ReactNode;
    children: ReactNode;
}

export const AdvancedTooltip = memo(
    ({ tooltipContent, children }: AdvancedTooltipProps) => {
        const [isOpened, setIsOpened] = useState(false);

        const handleOpen = useCallback(() => setIsOpened(true), []);
        const handleClose = useCallback(() => setIsOpened(false), []);

        return (
            <Popover
                opened={isOpened}
                onClose={handleClose}
                position='top'
                placement='center'
                spacing='sm'
                withArrow={true}
                trapFocus={false}
                closeOnEscape={false}
                transition='fade'
                styles={{ body: { pointerEvents: 'none' } }}
                target={
                    <div onMouseEnter={handleOpen} onMouseLeave={handleClose}>
                        {children}
                    </div>
                }
            >
                {tooltipContent}
            </Popover>
        );
    }
);
