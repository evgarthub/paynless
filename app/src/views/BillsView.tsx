import { memo } from 'react';
import { CurrencyDollar } from 'tabler-icons-react';
import { useBillsQuery } from '../client/queries/useBillsQuery';
import { MainContentLayout } from '../components';
import { BillsList } from '../components/BillsList';
import { globalLabel } from '../global/labels';
import { CreateBillModal } from '../components/CreateBillModal/CreateBillModal';

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
            {data?.data && <BillsList bills={data.data} />}
            <CreateBillModal />
        </MainContentLayout>
    );
});
