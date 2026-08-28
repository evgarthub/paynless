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
  Legend,
} from "recharts";
import { api } from "../../api/client";
import type { Utility, YearComparisonItem } from "../../types";

const YEAR_COLORS = [
  "#6366f1",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#84cc16",
];

function getYearColor(year: number, visibleYears: number[]): string {
  const index = visibleYears.indexOf(year);
  return YEAR_COLORS[index >= 0 ? index % YEAR_COLORS.length : 0];
}

export default function YearComparisonChart() {
  const { t } = useTranslation();
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [data, setData] = useState<YearComparisonItem[]>([]);
  const [selectedYears, setSelectedYears] = useState<Set<number>>(new Set());

  useEffect(() => {
    api.getUtilities().then((u) => {
      const consumptionUtils = u.filter((x) => x.type === "CONSUMPTION");
      setUtilities(consumptionUtils);
      if (consumptionUtils.length > 0) setSelectedId(consumptionUtils[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    api.getYearComparison(selectedId).then((d) => {
      setData(d);
      const years = [...new Set(d.flatMap((item) => item.years.map((y) => y.year)))].sort();
      const lastTwo = years.slice(-2);
      setSelectedYears(new Set(lastTwo));
    });
  }, [selectedId]);

  const selected = utilities.find((u) => u.id === selectedId);
  const allYears = data.length > 0
    ? [...new Set(data.flatMap((d) => d.years.map((y) => y.year)))].sort()
    : [];

  const toggleYear = (year: number) => {
    setSelectedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) {
        next.delete(year);
      } else {
        next.add(year);
      }
      return next;
    });
  };

  const visibleYears = allYears.filter((y) => selectedYears.has(y));

  const chartData = data.map((d) => {
    const row: Record<string, string | number> = { month: d.month };
    for (const y of d.years) {
      if (selectedYears.has(y.year)) {
        row[String(y.year)] = y.consumption;
      }
    }
    return row;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("dashboard.yearComparison")}
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
      {allYears.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {allYears.map((year) => (
            <label key={year} className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedYears.has(year)}
                onChange={() => toggleYear(year)}
                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{year}</span>
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{
                  backgroundColor: selectedYears.has(year)
                    ? getYearColor(year, visibleYears)
                    : "#d1d5db",
                }}
              />
            </label>
          ))}
        </div>
      )}
      {data.length === 0 || visibleYears.length === 0 ? (
        <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-8">
          {t("common.noData")}
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-stroke, #f0f0f0)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} />
            <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} />
            <Tooltip
              formatter={(value) => [
                `${Number(value)} ${selected?.unit || ""}`,
                undefined,
              ]}
            />
            <Legend />
            {visibleYears.map((year) => (
              <Line
                key={year}
                type="monotone"
                dataKey={String(year)}
                stroke={getYearColor(year, visibleYears)}
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
