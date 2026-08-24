export interface HAResponse {
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
}

export interface EstimateResult {
  projectedReading: number;
  dailyAvg: number;
  daysElapsed: number;
}

export interface BillItemInput {
  utilityId: string;
  inputType: "MANUAL" | "HA" | "ESTIMATED";
  previousReading?: number;
  currentReading?: number;
  appliedRate: number;
}

export interface CreateBillInput {
  billingPeriod: string;
  items: BillItemInput[];
}
