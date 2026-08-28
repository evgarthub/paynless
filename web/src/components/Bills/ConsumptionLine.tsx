import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Utility, TariffRate } from "../../types";
import type { LineItemDraft, PreviousReading } from "./createBillTypes";

interface Props {
  line: LineItemDraft;
  util: Utility;
  tariffs: TariffRate[];
  previousReadings: PreviousReading[];
  validationError?: string;
  onUpdate: (patch: Partial<LineItemDraft>) => void;
  onLoadHA: () => void;
  onLoadEstimate: () => void;
}

export default function ConsumptionLine({
  line,
  util,
  tariffs,
  previousReadings,
  validationError,
  onUpdate,
  onLoadHA,
  onLoadEstimate,
}: Props) {
  const { t } = useTranslation();

  const consumption = useMemo(
    () =>
      (
        parseFloat(line.currentReading || "0") -
        parseFloat(line.previousReading || "0")
      ).toFixed(1),
    [line.currentReading, line.previousReading],
  );

  const cost = useMemo(
    () =>
      (
        (parseFloat(line.currentReading || "0") -
          parseFloat(line.previousReading || "0")) *
        parseFloat(line.appliedRate || "0")
      ).toFixed(2),
    [line.currentReading, line.previousReading, line.appliedRate],
  );

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

  const handleManualClick = useCallback(() => {
    onUpdate({ inputType: "MANUAL" });
  }, [onUpdate]);

  const handleHAClick = useCallback(() => {
    onUpdate({ inputType: "HA" });
    onLoadHA();
  }, [onUpdate, onLoadHA]);

  const handlePreviousReadingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ previousReading: e.target.value });
    },
    [onUpdate],
  );

  const handlePreviousReadingSelect = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onUpdate({ previousReading: e.target.value });
    },
    [onUpdate],
  );

  const handleCurrentReadingChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ currentReading: e.target.value });
    },
    [onUpdate],
  );

  const handleRateSelectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (val === "custom") {
        onUpdate({ selectedTariffId: "custom", appliedRate: "0" });
      } else {
        const tariff = tariffs.find((t) => t.id === val);
        if (tariff) {
          onUpdate({
            selectedTariffId: tariff.id,
            appliedRate: tariff.ratePerUnit.toString(),
          });
        }
      }
    },
    [tariffs, onUpdate],
  );

  const handleCustomRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdate({ appliedRate: e.target.value });
    },
    [onUpdate],
  );

  const manualButtonClass = `px-3 py-1.5 rounded text-xs font-medium ${
    line.inputType === "MANUAL"
      ? "bg-gray-800 text-white"
      : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
  }`;

  const haButtonClass = `px-3 py-1.5 rounded text-xs font-medium ${
    line.inputType === "HA"
      ? "bg-purple-600 text-white"
      : "bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-40 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50"
  }`;

  const estimatedButtonClass = `px-3 py-1.5 rounded text-xs font-medium ${
    line.inputType === "ESTIMATED"
      ? "bg-orange-500 text-white"
      : "bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:hover:bg-orange-900/50"
  }`;

  const currentReadingClass = `w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm disabled:bg-gray-50 dark:disabled:bg-gray-700 ${
    validationError ? "border-red-500 bg-red-50 dark:bg-red-900/30" : ""
  }`;

  return (
    <>
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={handleManualClick}
          className={manualButtonClass}
        >
          {t("createBill.manual")}
        </button>
        <button
          type="button"
          onClick={handleHAClick}
          disabled={!util.haEntityId}
          className={haButtonClass}
        >
          {t("createBill.homeAssistant")}
        </button>
        <button
          type="button"
          onClick={onLoadEstimate}
          className={estimatedButtonClass}
        >
          {t("createBill.estimate")}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t("createBill.previousReading")}
          </label>
          <div className="flex gap-1">
            <input
              type="number"
              step="0.1"
              value={line.previousReading}
              onChange={handlePreviousReadingChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {previousReadings.length > 0 && (
              <select
                value={line.previousReading}
                onChange={handlePreviousReadingSelect}
                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 min-w-[140px]"
              >
                {previousReadings.map((r) => (
                  <option key={r.billingPeriod} value={r.value}>
                    {r.value} ({r.billingPeriod})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t("createBill.currentReading")}
          </label>
          <input
            type="number"
            step="0.1"
            value={line.currentReading}
            onChange={handleCurrentReadingChange}
            disabled={line.inputType === "HA"}
            className={currentReadingClass}
          />
          {validationError && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{validationError}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-3">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t("createBill.consumption", { unit: util.unit || "unit" })}
          </label>
          <div className="px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
            {consumption} {util.unit || "unit"}
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t("createBill.ratePerUnit", { unit: util.unit || "unit" })}
          </label>
          <select
            value={line.selectedTariffId}
            onChange={handleRateSelectChange}
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 mb-1"
          >
            {sortedTariffs.map((tariff) => (
              <option key={tariff.id} value={tariff.id}>
                ₴{tariff.ratePerUnit.toFixed(4)} (from{" "}
                {new Date(tariff.effectiveFrom).toLocaleDateString()})
              </option>
            ))}
            <option value="custom">{t("createBill.customRate")}</option>
          </select>
          {line.selectedTariffId === "custom" && (
            <input
              type="number"
              step="0.0001"
              value={line.appliedRate}
              onChange={handleCustomRateChange}
              className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          )}
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
            {t("createBill.cost")}
          </label>
          <div className="px-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">
            ₴{cost}
          </div>
        </div>
      </div>

      {line.inputType === "HA" && util.haEntityId && (
        <div className="mt-2 text-xs text-purple-600 dark:text-purple-400">
          {t("createBill.fetchingFrom")} <code>{util.haEntityId}</code>
        </div>
      )}
      {line.inputType === "ESTIMATED" && (
        <div className="mt-2 text-xs text-orange-600 dark:text-orange-400">
          {t("createBill.estimatedReading")}
        </div>
      )}
    </>
  );
}
