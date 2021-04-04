import { Tariff } from "../storage/models/Tariff";

export interface BillCalculatorHookProps {
    tariff: Tariff;
    amount: number;
}

export const useBillCalculator = ({ tariff, amount }: BillCalculatorHookProps) => {
    
};