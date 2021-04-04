import { gql } from "@apollo/client";

export const GET_BILLS = gql`
    query Bills {
        bills {
            amount,
            cost,
            date,
            id,
            month,
            value,
            year,
            type {
                color,
                id,
                label,
                unit,
            },
        }
    }
`;

export const GET_BILLS_BY_TYPE_LIMIT = gql`
    query Bills($typeId: ID!, $limit: Int) {
        bills(
            limit: $limit,
            where: {
                type: {
                    id: $typeId
                }
            }
        ) {
            amount,
            cost,
            date,
            id,
            month,
            value,
            year,
            type {
                color,
                id,
                label,
                unit,
            },
        }
    }
`;

export const GET_BILL = gql`
    query Bill($id: ID!) {
        bill(id: $id) {
            amount,
            cost,
            date,
            id,
            month,
            value,
            year,
            type {
                color,
                id,
                label,
                unit,
            },
        }
    }
`;

export const UPDATE_BILL = gql`
    mutation UpdateBill($id: ID!, $bill: editBillInput) {
        updateBill(
            input: {
                where: { id: $id },
                data: $bill,
            }
        ) {
            bill {
                amount,
                cost,
                date,
                id,
                month,
                value,
                year,
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

export const DELETE_BILL = gql`
    mutation DeleteBill($id: ID!) {
        deleteBill(
            input: {
                where: { id: $id },
            }
        ) {
            bill {
                amount,
                cost,
                date,
                id,
                month,
                value,
                year,
            },
        }
    }
`;

export const CREATE_BILL = gql`
    mutation CreateBill($bill: BillInput) {
        createBill (
            input: {
                data: $bill
            }
        ) {
            bill {
                amount,
                cost,
                date,
                id,
                month,
                value,
                year,
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

export const GET_BILLS_MONTH_GROUPED = gql`
    query BillsMonthGrouped {
        billsConnection {
            groupBy {
                month {
                    connection {
                        values {
                            amount,
                            cost,
                            date,
                            id,
                            month,
                            value,
                            year,
                            type {
                                color,
                                id,
                                label,
                                unit,
                            },
                        }
                        
                    }
                }
            }
        }
    }
`;