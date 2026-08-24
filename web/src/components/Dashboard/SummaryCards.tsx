import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import type { DashboardSummary } from "../../types";

const CURRENCY = "\u20B4";

export default function SummaryCards() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    api.getDashboardSummary().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border p-4 animate-pulse h-24"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: t("dashboard.spentThisMonth"),
      value: `${CURRENCY}${data.totalSpentThisMonth.toLocaleString()}`,
      sub: t("dashboard.ytd", {
        amount: `${CURRENCY}${data.totalSpentYTD.toLocaleString()}`,
      }),
    },
    {
      label: t("dashboard.avgMonthly"),
      value: `${CURRENCY}${data.avgMonthlyCost.toLocaleString()}`,
      sub: t("dashboard.billsCount", { count: data.billCount }),
    },
    {
      label: t("dashboard.unpaid"),
      value: `${CURRENCY}${data.unpaidTotal.toLocaleString()}`,
      sub: t("dashboard.unpaidCount", { count: data.unpaidCount }),
    },
    {
      label: t("dashboard.trend"),
      value: `${data.costTrend > 0 ? "+" : ""}${data.costTrend}%`,
      sub: t("dashboard.vsPreviousMonth"),
      highlight: data.costTrend > 0 ? "red" : "green",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border p-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            {card.label}
          </p>
          <p
            className={`text-2xl font-bold mt-1 ${
              card.highlight === "red"
                ? "text-red-600"
                : card.highlight === "green"
                ? "text-green-600"
                : "text-gray-900"
            }`}
          >
            {card.value}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
