export interface LineItemDraft {
  utilityId: string;
  included: boolean;
  inputType: "MANUAL" | "HA" | "ESTIMATED";
  previousReading: string;
  currentReading: string;
  appliedRate: string;
  selectedTariffId: string | "custom";
}

export interface PreviousReading {
  value: number;
  billingPeriod: string;
}
