import React, { ReactNode, useCallback, useMemo, useRef } from "react";
import { CreateBillInput, useCreateBill } from "../../storage/models/Bill";
import { PaymentContext } from "./PaymentContext";

interface PaymentProviderProps {
    children: ReactNode;
}

export const PaymentProvider = ({ children }: PaymentProviderProps) => {
    const billsRef = useRef<CreateBillInput[]>([]);
    const [ createBill ] = useCreateBill();

    const create = useCallback(async () => {
        await billsRef.current.forEach( async bill => {
            await createBill(bill);
        });
    }, [createBill]);

    const addBill = useCallback((bill: CreateBillInput) => {
        billsRef.current.push(bill);
    }, []);

    const value = useMemo(() => ({
        bills: billsRef.current,
        create,
        addBill,
    }), [addBill, create]);

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    )
}