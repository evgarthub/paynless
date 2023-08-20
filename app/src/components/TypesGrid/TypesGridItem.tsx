import {
    Badge,
    MantineColor,
    Paper,
    SimpleGrid,
    Title,
    Text,
    Group,
} from '@mantine/core';
import { memo, useCallback } from 'react';
import { Trash } from 'tabler-icons-react';
import { useDeleteTypeMutation } from '../../client/mutations/useDeleteTypeMutation';
import { globalLabel } from '../../global/labels';
import { ActionIconConfirm } from '../ActionIconConfirm';

export interface TypesGridItemProps {
    color: MantineColor;
    title: string;
    name: string;
    unit: string;
    id: number;
}

export const TypesGridItem = memo(
    ({ color, title, name, unit, id }: TypesGridItemProps) => {
        const { mutateAsync } = useDeleteTypeMutation();

        const handleDelete = useCallback(async () => {
            await mutateAsync({ typeId: id });
        }, [id, mutateAsync]);

        return (
            <Paper
                shadow='md'
                radius='lg'
                p='lg'
                withBorder={true}
                sx={{ minWidth: 280 }}
            >
                <Group position='apart' align='center' mb='md'>
                    <Title order={3}>{title}</Title>
                    <ActionIconConfirm
                        color='red'
                        confirmMessage={
                            globalLabel.typesView.list.deleteConfirmMessage
                        }
                        icon={Trash}
                        onClick={handleDelete}
                        // position='left'
                        tooltip={globalLabel.typesView.list.deleteTooltip}
                    />
                </Group>
                <SimpleGrid cols={2}>
                    <Text weight={500}>
                        {globalLabel.typesView.typeItem.name}
                    </Text>
                    <Text>{name}</Text>
                    <Text weight={500}>{globalLabel.unit}</Text>
                    <Text>{unit}</Text>
                    <Text weight={500}>
                        {globalLabel.typesView.typeItem.color}
                    </Text>
                    <Badge color={color} radius='md' variant='filled'>
                        {color}
                    </Badge>
                </SimpleGrid>
            </Paper>
        );
    }
);

TypesGridItem.displayName = 'TypesGridItem';
