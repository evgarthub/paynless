import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { api } from "../../api/client";
import type { SpendingByPeriodItem } from "../../types";

const COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
];

interface Props {
  from: string;
  to: string;
}

export default function SpendingChart({ from, to }: Props) {
  const { t } = useTranslation();
  const [data, setData] = useState<SpendingByPeriodItem[]>([]);

  useEffect(() => {
    api
      .getDashboardSpending(from, to, "period")
      .then((d) => setData(d as SpendingByPeriodItem[]))
      .catch(console.error);
  }, [from, to]);

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t("dashboard.monthlySpending")}
        </h3>
        <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">
          {t("common.noData")}
        </p>
      </div>
    );
  }

  const utilityNames = [
    ...new Set(data.flatMap((d) => d.byUtility.map((u) => u.name))),
  ];

  const chartData = data.map((d) => {
    const row: Record<string, string | number> = { period: d.period };
    for (const u of d.byUtility) {
      row[u.name] = Math.round(u.amount * 100) / 100;
    }
    return row;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t("dashboard.monthlySpending")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-stroke, #f0f0f0)" />
          <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
          <Tooltip
            formatter={(value) => [
              `${"\u20B4"}${Number(value).toLocaleString()}`,
              undefined,
            ]}
          />
          <Legend />
          {utilityNames.map((name, i) => (
            <Bar
              key={name}
              dataKey={name}
              stackId="a"
              fill={COLORS[i % COLORS.length]}
              radius={
                i === utilityNames.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]
              }
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
