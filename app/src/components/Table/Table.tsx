import { Table as MantineTable } from '@mantine/core';
import { memo } from 'react';
import { TableHeader } from './TableHeader';
import { SimpleRowData, TableRow } from './TableRow';

export interface TableProps<TRowData> {
    rows: TRowData[];
    header: TRowData;
}

export const Table = memo(
    <T extends SimpleRowData>({ rows, header }: TableProps<T>) => {
        const keys = Object.keys(header);

        return (
            <MantineTable verticalSpacing='sm' highlightOnHover={true}>
                <thead>
                    <TableHeader data={header} />
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <TableRow key={i} data={r} keys={keys} />
                    ))}
                </tbody>
            </MantineTable>
        );
    }
);
