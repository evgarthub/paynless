import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { api } from "../../api/client";
import type { SpendingByType } from "../../types";

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#06b6d4"];

interface Props {
  from: string;
  to: string;
}

export default function CostBreakdownPie({ from, to }: Props) {
  const { t } = useTranslation();
  const [data, setData] = useState<SpendingByType | null>(null);
  const [byUtility, setByUtility] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    Promise.all([
      api.getSpendingByType(from, to),
      api.getDashboardSpending(from, to, "utility"),
    ]).then(([byType, byUtil]) => {
      setData(byType);
      setByUtility(
        (byUtil as { name: string; totalCost: number }[]).map((u) => ({
          name: u.name,
          value: u.totalCost,
        }))
      );
    });
  }, [from, to]);

  if (!data || byUtility.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          {t("dashboard.costBreakdown")}
        </h3>
        <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">
          {t("common.noData")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t("dashboard.costBreakdown")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={byUtility}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {byUtility.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              `${"\u20B4"}${Number(value).toLocaleString()}`,
              undefined,
            ]}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
