import { memo } from 'react';
import { ColorSwatch } from 'tabler-icons-react';
import { useTypesQuery } from '../client/queries/useTypesQuery';
import { MainContentLayout, TypesGrid } from '../components';
import { CreateTypeModal } from '../components/CreateTypeModal/CreateTypeModal';
import { globalLabel } from '../global/labels';

export const TypesView = memo(() => {
    const { data, isLoading, isError } = useTypesQuery();

    return (
        <MainContentLayout
            title={globalLabel.typesView.title}
            description={globalLabel.typesView.description}
            icon={ColorSwatch}
            isError={isError}
            isLoading={isLoading}
        >
            {data?.data && <TypesGrid types={data.data} />}
            <CreateTypeModal />
        </MainContentLayout>
    );
});

TypesView.displayName = 'TypesView';
