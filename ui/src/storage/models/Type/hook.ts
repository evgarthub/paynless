import { useQuery } from "@apollo/client";
import { TypeData, TypesData } from "./interface";
import { GET_TYPE, GET_TYPES } from "./query";

export const useGetTypes = () => {
    const { data, loading, error, refetch } = useQuery<TypesData>(GET_TYPES);

    return {
        error,
        refetch,
        data: data?.types,
        isLoading: loading,
        isFailed: !!error,
    };
}

export const useGetType = (id: string) => {
    const { data, loading, error, refetch } = useQuery<TypeData>(GET_TYPE, { variables: { id } });

    return {
        error,
        refetch,
        data: data?.type,
        isLoading: loading,
        isFailed: !!error,
    };
}