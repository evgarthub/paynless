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
                arrowPosition='center'
                withArrow={true}
                trapFocus={false}
                closeOnEscape={false}
                styles={{ arrow: { pointerEvents: 'none' } }}
            >
                <Popover.Target>
                    <div onMouseEnter={handleOpen} onMouseLeave={handleClose}>
                        {children}
                    </div>
                </Popover.Target>
                <Popover.Dropdown>{tooltipContent}</Popover.Dropdown>
            </Popover>
        );
    }
);
