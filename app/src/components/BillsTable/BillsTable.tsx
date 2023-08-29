import { BillUtil } from '@client/models/Bills';
import { Table } from '@components/Table';
import { globalLabel } from '@global/labels';
import { memo, useMemo } from 'react';
import { getFormattedUtil } from './getFormattedUtil';

export interface BillsTableProps {
    utils: ReadonlyArray<BillUtil>;
}

export const BillsTable = memo(({ utils }: BillsTableProps) => {
    const formattedData = useMemo(() => utils.map(getFormattedUtil), [utils]);

    return <Table header={globalLabel.billsView.table} rows={formattedData} />;
});

BillsTable.displayName = 'BillsTable';
