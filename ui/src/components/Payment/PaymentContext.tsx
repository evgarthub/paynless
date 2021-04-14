import { createContext } from "react";
import { CreateBillInput } from "../../storage/models/Bill";

export interface PaymentContextValue {
    bills: CreateBillInput[];
    create: () => Promise<void>;
}

export const PaymentContext = createContext<PaymentContextValue | null>(null);