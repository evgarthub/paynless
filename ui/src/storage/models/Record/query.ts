import { gql } from "@apollo/client";

export const GET_RECORDS = gql`
    query Records($from: Date, $till: Date) {
        records(
            sort: "date:desc"
        ) {
            date,
            id,
            value,
            type {
                color,
                id,
                label,
                unit,
            },
        }
    }
`;

export const GET_RECORDS_BY_RANGE = gql`
    query Records($from: Date, $till: Date) {
        records(
            sort: "date:desc",
            where: {
                date_gt: $from,
                date_lte: $till,
            }
        ) {
            date,
            id,
            value,
            type {
                color,
                id,
                label,
                unit,
            },
        }
    }
`;

export const GET_RECORDS_BY_RANGE_FOR_TYPE = gql`
    query Records($typeId: ID, $from: Date, $till: Date) {
        records(
            sort: "date:desc",
            where: {
                type: {
                    id: $typeId
                },
                date_gt: $from,
                date_lte: $till,
            }
        ) {
            date,
            id,
            value,
            type {
                color,
                id,
                label,
                unit,
            },
        }
    }
`;

export const GET_RECORD = gql`
    query Record($id: ID!) {
        record(id: $id) {
            date,
            id,
            value,
            type {
                color,
                id,
                label,
                unit,
            },
        }
    }
`;

export const UPDATE_RECORD = gql`
    mutation UpdateRecord($id: ID!, $record: editRecordInput) {
        updateRecord(
            input: {
                where: { id: $id },
                data: $record,
            }
        ) {
            record {
                date,
                id,
                value,
                type {
                    color,
                    id,
                    label,
                    unit,
                },
            }
        }
    }
`;

export const DELETE_RECORD = gql`
    mutation DeleteRecord($id: ID!) {
        deleteRecord(
            input: {
                where: { id: $id },
            }
        ) {
            record {
                date,
                id,
                value,
            },
        }
    }
`;

export const CREATE_RECORD = gql`
    mutation CreateRecord($record: RecordInput) {
        createRecord (
            input: {
                data: $record
            }
        ) {
            record {
                date,
                id,
                value,
                type {
                    color,
                    id,
                    label,
                    unit,
                },
            }
        }
        
    }
`;