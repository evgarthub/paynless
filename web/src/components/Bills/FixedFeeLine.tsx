import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { TariffRate } from "../../types";
import type { LineItemDraft } from "./createBillTypes";

interface Props {
  line: LineItemDraft;
  tariffs: TariffRate[];
  onUpdate: (patch: Partial<LineItemDraft>) => void;
}

export default function FixedFeeLine({ line, tariffs, onUpdate }: Props) {
  const { t } = useTranslation();

  const sortedTariffs = useMemo(
    () =>
      tariffs
        .filter((tariff) => tariff.utilityId === line.utilityId)
        .sort(
          (a, b) =>
            new Date(b.effectiveFrom).getTime() -
            new Date(a.effectiveFrom).getTime(),
        ),
    [tariffs, line.utilityId],
  );

  const handleTariffChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === "custom") {
        onUpdate({ selectedTariffId: "custom", appliedRate: "0" });
      } else {
        const tariff = tariffs.find((t) => t.id === val);
        if (tariff) {
          onUpdate({
            selectedTariffId: tariff.id,
            appliedRate: tariff.fixedFee.toString(),
          });
        }
      }
    },
    [tariffs, onUpdate],
  );

  const handleCustomAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ appliedRate: e.target.value });
    },
    [onUpdate],
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
          {t("createBill.fixedFee")}
        </label>
        <select
          value={line.selectedTariffId}
          onChange={handleTariffChange}
          className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 mb-1"
        >
          {sortedTariffs.map((tariff) => (
            <option key={tariff.id} value={tariff.id}>
              ₴{tariff.fixedFee.toFixed(2)} (from{" "}
              {new Date(tariff.effectiveFrom).toLocaleDateString()})
            </option>
          ))}
          <option value="custom">{t("createBill.customAmount")}</option>
        </select>
        {line.selectedTariffId === "custom" && (
          <input
            type="number"
            step="0.01"
            value={line.appliedRate}
            onChange={handleCustomAmountChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        )}
      </div>
    </div>
  );
}
