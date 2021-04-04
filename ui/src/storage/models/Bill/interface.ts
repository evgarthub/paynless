import moment from "moment";
import { EMPTY_TYPE, NewType, Type } from "../Type";

export interface Bill extends NewBill {
    id?: string;
    type?: Type;
}

export interface NewBill {
    amount: number;
    cost: number;
    date: string;
    month: number;
    value: number;
    year: number;
    type?: NewType;
}

export interface BillsData {
    bills: Bill[];
}

export interface BillData {
    bill: Bill;
}

export interface BillConnectionMonthData {
    billsConnection: {
        groupBy: {
            month: {
                connection: {
                    values: Bill[];
                }
            }[]
        }
    }
}

export interface EditBillInput {
    amount: number;
    cost: number;
    date: string;
    month: number;
    value: number;
    year: number;
    type: string;
}

export interface UpdateBillProps {
    id: string;
    record: EditBillInput;
}

export interface DeleteBillProps {
    id: string;
}

export const EMPTY_RECORD: NewBill = {
    amount: 0,
    cost: 0,
    month: moment().month(),
    value: 0,
    year: 2020,
    date: moment().toISOString(),
    type: EMPTY_TYPE
}

export interface BillsGroupedMonth {
    [key: number]: Bill[];
}