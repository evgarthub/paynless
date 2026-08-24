import { useState } from "react";
import { useTranslation } from "react-i18next";

type Range = "month" | "quarter" | "year" | "all";

interface Props {
  value: Range;
  onChange: (range: Range) => void;
}

const ranges: Range[] = ["month", "quarter", "year", "all"];

export default function TimeRangeSelector({ value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {ranges.map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            value === r
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t(`dashboard.range.${r}`)}
        </button>
      ))}
    </div>
  );
}

export function getRangeDates(range: Range): { from: string; to: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

  const to = fmt(now);

  switch (range) {
    case "month":
      return { from: fmt(new Date(y, m, 1)), to };
    case "quarter":
      return { from: fmt(new Date(y, m - 2, 1)), to };
    case "year":
      return { from: fmt(new Date(y, 0, 1)), to };
    case "all":
      return { from: "2000-01", to };
  }
}
