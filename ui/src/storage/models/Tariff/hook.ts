import { useQuery } from "@apollo/client";
import { TariffData, TariffsData } from "./interface";
import { GET_TARIFF, GET_TARIFFS } from "./query";

export const useGetTariffs = () => {
    const { data, loading, error, refetch } = useQuery<TariffsData>(GET_TARIFFS);

    return {
        error,
        refetch,
        data: data?.tariffs,
        isLoading: loading,
        isFailed: !!error,
    };
}

export const useGetTariff = (id: string) => {
    const { data, loading, error, refetch } = useQuery<TariffData>(GET_TARIFF, { variables: { id } });

    return {
        error,
        refetch,
        data: data?.tariff,
        isLoading: loading,
        isFailed: !!error,
    };
}