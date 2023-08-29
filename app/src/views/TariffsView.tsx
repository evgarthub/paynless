import { memo } from 'react';
import { CurrencyCent } from 'tabler-icons-react';
import { useTariffsQuery } from '../client/queries/useTariffsQuery';
import { useTypesQuery } from '../client/queries/useTypesQuery';
import { MainContentLayout, TariffsList } from '../components';
import { globalLabel } from '../global/labels';

export const TariffsView = memo(() => {
    const {
        data: tariffsData,
        isLoading: isTariffsLoading,
        isError: isTariffsError,
    } = useTariffsQuery();
    const {
        data: typesData,
        isLoading: isTypesLoading,
        isError: isTypesError,
    } = useTypesQuery();

    return (
        <MainContentLayout
            title={globalLabel.tariffsView.title}
            description={globalLabel.tariffsView.description}
            icon={CurrencyCent}
            isError={isTariffsError || isTypesError}
            isLoading={isTariffsLoading || isTypesLoading}
        >
            {typesData && tariffsData && (
                <TariffsList tariffs={tariffsData} types={typesData} />
            )}
        </MainContentLayout>
    );
});

TariffsView.displayName = 'TariffsView';
