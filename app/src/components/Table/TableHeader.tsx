import { memo } from 'react';
import { SimpleRowData } from './TableRow';

export interface TableHeaderProps {
    data: SimpleRowData;
}

export const TableHeader = memo(({ data }: TableHeaderProps) => {
    const dataArrayed = Object.values(data);

    return (
        <tr>
            {dataArrayed.map((r, i) => (
                <th key={i}>{r}</th>
            ))}
        </tr>
    );
});
