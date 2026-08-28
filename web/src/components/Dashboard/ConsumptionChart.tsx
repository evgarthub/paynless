import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../api/client";
import type { Utility, ConsumptionTrendItem } from "../../types";

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

export default function ConsumptionChart({ from, to }: Props) {
  const { t } = useTranslation();
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<ConsumptionTrendItem[]>([]);

  useEffect(() => {
    api.getUtilities().then((u) => {
      setUtilities(u);
      if (u.length > 0) setSelectedId(u[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    api
      .getConsumptionTrend(selectedId, from, to)
      .then(setData)
      .catch(console.error);
  }, [selectedId, from, to]);

  const selected = utilities.find((u) => u.id === selectedId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("dashboard.consumptionTrend")}
        </h3>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-700"
        >
          {utilities.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>
      {data.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">
          {t("common.noData")}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-stroke, #f0f0f0)" />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip
              formatter={(value, name) => {
                if (name === "consumption") {
                  return [`${value} ${selected?.unit || ""}`, t("dashboard.consumption")];
                }
                return [`${"\u20B4"}${Number(value).toLocaleString()}`, t("dashboard.cost")];
              }}
            />
            <Line
              type="monotone"
              dataKey="consumption"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="consumption"
            />
            <Line
              type="monotone"
              dataKey="cost"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="cost"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
