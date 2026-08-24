export interface Utility {
  id: string;
  name: string;
  type: "CONSUMPTION" | "FIXED";
  unit: string | null;
  haEntityId: string | null;
  createdAt: string;
}

export interface TariffRate {
  id: string;
  utilityId: string;
  ratePerUnit: number;
  fixedFee: number;
  referenceUrl: string | null;
  effectiveFrom: string;
}

export interface Bill {
  id: string;
  billingPeriod: string;
  totalAmount: number;
  status: "UNPAID" | "PAID";
  createdAt: string;
}

export interface BillItem {
  id: string;
  billId: string;
  utilityId: string;
  inputType: "MANUAL" | "HA" | "ESTIMATED";
  previousReading: number | null;
  currentReading: number | null;
  consumption: number | null;
  appliedRate: number;
  totalCost: number;
  isEstimated: boolean | null;
}

export interface BillWithItems extends Bill {
  items: BillItem[];
}

export interface HAResponse {
  entityId: string;
  value: number;
  unit: string | null;
  lastChanged: string;
}

export interface EstimateResult {
  projectedReading: number;
  dailyAvg: number;
  daysElapsed: number;
}
