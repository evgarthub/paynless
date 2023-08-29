import { memo } from 'react';
import { CurrencyDollar } from 'tabler-icons-react';
import { useBillsQuery } from '../client/queries/useBillsQuery';
import { MainContentLayout } from '../components';
import { BillsList } from '../components/BillsList';
import { globalLabel } from '../global/labels';
import { CreateBill } from '@components/CreateBill';

export const BillsView = memo(() => {
    const { data, isError, isLoading } = useBillsQuery();

    return (
        <MainContentLayout
            title={globalLabel.billsView.title}
            description={globalLabel.billsView.description}
            icon={CurrencyDollar}
            isError={isError}
            isLoading={isLoading}
        >
            {data && <BillsList bills={data} />}
            <CreateBill />
        </MainContentLayout>
    );
});
