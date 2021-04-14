import { Bill } from "../../storage/models/Bill";

export interface PaymentProps {
    month: number;
    onCreate: (bill: Bill) => void;
}
