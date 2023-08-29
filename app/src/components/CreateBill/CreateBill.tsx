import { Affix, Button, Kbd } from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { memo } from 'react';
import { globalLabel } from '@global/labels';
import { AdvancedTooltip } from '../AdvancedTooltip';
import { CreateBillModal } from './CreateBillModal';

const { createButton } = globalLabel.createBill;

export const CreateBill = memo(() => {
    const [isOpened, handleModal] = useDisclosure(false);

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
            <CreateBillModal
                onClose={handleModal.close}
                isOpened={isOpened}
                onOpen={handleModal.open}
            />
        </>
    );
});

CreateBill.displayName = 'CreateBill';
