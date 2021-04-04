import { gql } from "@apollo/client";

export const GET_TYPES = gql`
    query Types {
        types {
            id,
            label,
            uid,
            unit,
            color,
        }
    }
`;

export const GET_TYPE = gql`
    query Type($id: ID!) {
        type(id: $id) {
            id,
            label,
            uid,
            unit,
            color,
        }
    }
`;