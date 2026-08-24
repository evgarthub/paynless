import { useState } from "react";
import { useTranslation } from "react-i18next";
import TimeRangeSelector, { getRangeDates } from "./TimeRangeSelector";
import SummaryCards from "./SummaryCards";
import SpendingChart from "./SpendingChart";
import ConsumptionChart from "./ConsumptionChart";
import CostBreakdownPie from "./CostBreakdownPie";
import YearComparisonChart from "./YearComparisonChart";

type Range = "month" | "quarter" | "year" | "all";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [range, setRange] = useState<Range>("year");
  const { from, to } = getRangeDates(range);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">{t("dashboard.title")}</h1>
        <TimeRangeSelector value={range} onChange={setRange} />
      </div>

      <SummaryCards />

      <SpendingChart from={from} to={to} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConsumptionChart from={from} to={to} />
        <CostBreakdownPie from={from} to={to} />
      </div>

      <YearComparisonChart />
    </div>
  );
}
