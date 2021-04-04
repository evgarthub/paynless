import { gql } from "@apollo/client";

export const GET_TARIFFS = gql`
    query Tariffs {
        tariffs {
            id,
            source,
            startDate,
            isAbsolute,
            costs {
                cost,
                limit,
            },
            type {
                id
            }
        }
    }
`;

export const GET_TARIFF = gql`
    query Tariff($id: ID!) {
        tariff(id: $id) {
            id,
            source,
            startDate,
            isAbsolute,
            costs {
                cost,
                limit,
            },
            type {
                id
            }
        }
    }
`;