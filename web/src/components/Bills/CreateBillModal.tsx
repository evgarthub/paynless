import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import type { Utility, BillItem, TariffRate } from "../../types";
import type { LineItemDraft, PreviousReading } from "./createBillTypes";
import FixedFeeLine from "./FixedFeeLine";
import ConsumptionLine from "./ConsumptionLine";

interface Props {
  onSaved: () => void;
  onCancel: () => void;
}

export default function CreateBillModal({ onSaved, onCancel }: Props) {
  const { t } = useTranslation();
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [tariffs, setTariffs] = useState<TariffRate[]>([]);
  const [billingPeriod, setBillingPeriod] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [lines, setLines] = useState<LineItemDraft[]>([]);
  const [saving, setSaving] = useState(false);
  const [previousReadings, setPreviousReadings] = useState<
    Record<string, PreviousReading[]>
  >({});
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    api.getUtilities().then((u) => {
      setUtilities(u);
      setLines(
        u.map((util) => ({
          utilityId: util.id,
          included: true,
          inputType:
            util.type === "FIXED" ? ("MANUAL" as const) : ("MANUAL" as const),
          previousReading: "",
          currentReading: "",
          appliedRate: "0",
          selectedTariffId: "custom" as const,
        })),
      );

      u.forEach((util) => {
        api
          .getCurrentTariff(util.id)
          .then((tariff) => {
            setLines((prevLines) =>
              prevLines.map((line) =>
                line.utilityId === util.id
                  ? {
                      ...line,
                      appliedRate: tariff.ratePerUnit.toString(),
                      selectedTariffId: tariff.id,
                    }
                  : line,
              ),
            );
          })
          .catch(() => {});

        if (util.type === "CONSUMPTION") {
          api.getPreviousReadings(util.id, 3).then((readings) => {
            setPreviousReadings((prev) => ({ ...prev, [util.id]: readings }));

            if (readings.length > 0) {
              const lastReading = readings[0];
              setLines((prevLines) =>
                prevLines.map((line) =>
                  line.utilityId === util.id
                    ? { ...line, previousReading: lastReading.value.toString() }
                    : line,
                ),
              );
            }
          });
        }
      });
    });
    api.getTariffs().then(setTariffs);
  }, []);

  const updateLine = useCallback(
    (idx: number, patch: Partial<LineItemDraft>) => {
      setLines((prev) =>
        prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)),
      );

      const line = lines[idx];
      if (line) {
        setValidationErrors((prev) => {
          const next = { ...prev };
          delete next[`${line.utilityId}-current`];
          return next;
        });
      }
    },
    [lines],
  );

  const validateLine = useCallback(
    (idx: number): boolean => {
      const line = lines[idx];
      const util = utilities.find((u) => u.id === line.utilityId);
      if (!util || util.type === "FIXED") return true;

      const prev = parseFloat(line.previousReading || "0");
      const curr = parseFloat(line.currentReading || "0");

      if (line.currentReading && line.previousReading && curr < prev) {
        setValidationErrors((prev) => ({
          ...prev,
          [`${line.utilityId}-current`]: t("createBill.validationError"),
        }));
        return false;
      }
      return true;
    },
    [lines, utilities, t],
  );

  const loadHAImpReading = useCallback(
    async (idx: number) => {
      const line = lines[idx];
      const util = utilities.find((u) => u.id === line.utilityId);
      if (!util?.haEntityId) return;
      try {
        const reading = await api.getHAReading(util.id);
        updateLine(idx, { currentReading: reading.value.toString() });
      } catch (err) {
        alert(t("createBill.haFetchFailed", { err }));
      }
    },
    [lines, utilities, updateLine, t],
  );

  const loadEstimate = useCallback(
    async (idx: number) => {
      const line = lines[idx];
      try {
        const est = await api.getEstimate(
          line.utilityId,
          parseFloat(line.previousReading || "0"),
          billingPeriod,
        );
        updateLine(idx, {
          currentReading: est.projectedReading.toString(),
          inputType: "ESTIMATED",
        });
      } catch (err) {
        alert(t("createBill.estimationFailed", { err }));
      }
    },
    [lines, billingPeriod, updateLine, t],
  );

  const handleBillingPeriodChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBillingPeriod(e.target.value);
    },
    [],
  );

  const handleLineIncludedChange = useCallback(
    (idx: number, checked: boolean) => {
      updateLine(idx, { included: checked });
    },
    [updateLine],
  );

  const handleLineUpdate = useCallback(
    (idx: number) => (patch: Partial<LineItemDraft>) => {
      updateLine(idx, patch);
    },
    [updateLine],
  );

  const handleLoadHA = useCallback(
    (idx: number) => () => {
      loadHAImpReading(idx);
    },
    [loadHAImpReading],
  );

  const handleLoadEstimate = useCallback(
    (idx: number) => () => {
      loadEstimate(idx);
    },
    [loadEstimate],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      let hasErrors = false;
      lines.forEach((_, idx) => {
        if (!validateLine(idx)) {
          hasErrors = true;
        }
      });
      if (hasErrors) return;

      setSaving(true);
      try {
        const items: BillItem[] = lines
          .filter((l) => {
            if (!l.included) return false;
            const util = utilities.find((u) => u.id === l.utilityId);
            if (util?.type === "FIXED") return true;
            return l.appliedRate !== "0";
          })
          .map((l) => ({
            id: "",
            billId: "",
            utilityId: l.utilityId,
            inputType: l.inputType,
            previousReading: l.previousReading
              ? parseFloat(l.previousReading)
              : null,
            currentReading: l.currentReading
              ? parseFloat(l.currentReading)
              : null,
            consumption:
              l.previousReading && l.currentReading
                ? Math.round(
                    (parseFloat(l.currentReading) -
                      parseFloat(l.previousReading)) *
                      10,
                  ) / 10
                : null,
            appliedRate: parseFloat(l.appliedRate),
            totalCost: 0,
            isEstimated: l.inputType === "ESTIMATED",
          }));

        await api.createBill({ billingPeriod, items });
        onSaved();
      } finally {
        setSaving(false);
      }
    },
    [lines, utilities, billingPeriod, validateLine, onSaved],
  );

  const renderLine = useCallback(
    (line: LineItemDraft, idx: number) => {
      const util = utilities.find((u) => u.id === line.utilityId);
      if (!util) return null;

      const handleUpdate = handleLineUpdate(idx);
      const onLoadHA = handleLoadHA(idx);
      const onLoadEstimate = handleLoadEstimate(idx);
      const onIncludedChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        handleLineIncludedChange(idx, e.target.checked);

      return (
        <div
          key={line.utilityId}
          className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 ${!line.included ? "opacity-50" : ""}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={line.included}
                onChange={onIncludedChange}
                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-gray-900 dark:text-gray-100">{util.name}</span>
            </label>
            <span
              className={`px-2 py-0.5 rounded text-xs font-medium ${
                util.type === "CONSUMPTION"
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
              }`}
            >
              {util.type}
            </span>
          </div>

          {line.included &&
            (util.type === "FIXED" ? (
              <FixedFeeLine
                line={line}
                tariffs={tariffs}
                onUpdate={handleUpdate}
              />
            ) : (
              <ConsumptionLine
                line={line}
                util={util}
                tariffs={tariffs}
                previousReadings={previousReadings[line.utilityId] || []}
                validationError={validationErrors[`${line.utilityId}-current`]}
                onUpdate={handleUpdate}
                onLoadHA={onLoadHA}
                onLoadEstimate={onLoadEstimate}
              />
            ))}
        </div>
      );
    },
    [
      utilities,
      tariffs,
      previousReadings,
      validationErrors,
      handleLineUpdate,
      handleLoadHA,
      handleLoadEstimate,
      handleLineIncludedChange,
    ],
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("createBill.title")}</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("createBill.billingPeriod")}
              </label>
              <input
                type="month"
                value={billingPeriod}
                onChange={handleBillingPeriodChange}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>

            <div className="space-y-4">
              {lines.map(renderLine)}
            </div>

            <div className="flex gap-2 mt-6">
              <button
                type="submit"
                disabled={saving}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving ? t("createBill.creating") : t("createBill.createBill")}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {t("common.cancel")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
