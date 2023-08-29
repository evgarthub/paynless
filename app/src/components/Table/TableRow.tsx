import { Text } from '@mantine/core';
import { memo } from 'react';

export interface SimpleRowData {
    [key: string]: string | number | undefined;
}

export interface TableRowProps {
    data: SimpleRowData;
    keys: string[];
}

export const TableRow = memo(({ data, keys }: TableRowProps) => (
    <tr>
        {keys.map((key) => (
            <td key={key}>
                <Text size='sm' color='gray'>
                    {data[key]}
                </Text>
            </td>
        ))}
    </tr>
));
