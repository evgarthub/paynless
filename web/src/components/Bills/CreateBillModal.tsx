import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import type { Utility, BillItem, TariffRate } from "../../types";

interface LineItemDraft {
  utilityId: string;
  included: boolean;
  inputType: "MANUAL" | "HA" | "ESTIMATED";
  previousReading: string;
  currentReading: string;
  appliedRate: string;
  selectedTariffId: string | "custom";
}

interface PreviousReading {
  value: number;
  billingPeriod: string;
}

interface Props {
  onSaved: () => void;
  onCancel: () => void;
}

export default function CreateBillModal({ onSaved, onCancel }: Props) {
  const { t } = useTranslation();
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [tariffs, setTariffs] = useState<TariffRate[]>([]);
  const [billingPeriod, setBillingPeriod] = useState(
    new Date().toISOString().slice(0, 7)
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
          inputType: util.type === "FIXED" ? "MANUAL" as const : "MANUAL" as const,
          previousReading: "",
          currentReading: "",
          appliedRate: "0",
          selectedTariffId: "custom" as const,
        }))
      );

      u.forEach((util) => {
        api.getCurrentTariff(util.id)
          .then((tariff) => {
            setLines((prevLines) =>
              prevLines.map((line) =>
                line.utilityId === util.id
                  ? {
                      ...line,
                      appliedRate: tariff.ratePerUnit.toString(),
                      selectedTariffId: tariff.id,
                    }
                  : line
              )
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
                    : line
                )
              );
            }
          });
        }
      });
    });
    api.getTariffs().then(setTariffs);
  }, []);

  const updateLine = (idx: number, patch: Partial<LineItemDraft>) => {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));

    const line = lines[idx];
    if (line) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[`${line.utilityId}-current`];
        return next;
      });
    }
  };

  const validateLine = (idx: number): boolean => {
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
  };

  const loadHAImpReading = async (idx: number) => {
    const line = lines[idx];
    const util = utilities.find((u) => u.id === line.utilityId);
    if (!util?.haEntityId) return;
    try {
      const reading = await api.getHAReading(util.id);
      updateLine(idx, { currentReading: reading.value.toString() });
    } catch (err) {
      alert(t("createBill.haFetchFailed", { err }));
    }
  };

  const loadEstimate = async (idx: number) => {
    const line = lines[idx];
    try {
      const est = await api.getEstimate(
        line.utilityId,
        parseFloat(line.previousReading || "0"),
        billingPeriod
      );
      updateLine(idx, {
        currentReading: est.projectedReading.toString(),
        inputType: "ESTIMATED",
      });
    } catch (err) {
      alert(t("createBill.estimationFailed", { err }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          previousReading: l.previousReading ? parseFloat(l.previousReading) : null,
          currentReading: l.currentReading ? parseFloat(l.currentReading) : null,
          consumption:
            l.previousReading && l.currentReading
              ? Math.round((parseFloat(l.currentReading) - parseFloat(l.previousReading)) * 10) / 10
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
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">{t("createBill.title")}</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("createBill.billingPeriod")}
              </label>
              <input
                type="month"
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-4">
              {lines.map((line, idx) => {
                const util = utilities.find((u) => u.id === line.utilityId);
                if (!util) return null;

                return (
                  <div
                    key={line.utilityId}
                    className={`border rounded-lg p-4 ${!line.included ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={line.included}
                          onChange={(e) => updateLine(idx, { included: e.target.checked })}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="font-semibold">{util.name}</span>
                      </label>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          util.type === "CONSUMPTION"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {util.type}
                      </span>
                    </div>

                    {line.included && (
                      util.type === "FIXED" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">{t("createBill.fixedFee")}</label>
                            <select
                              value={line.selectedTariffId}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "custom") {
                                  updateLine(idx, { selectedTariffId: "custom", appliedRate: "0" });
                                } else {
                                  const tariff = tariffs.find((t) => t.id === val);
                                  if (tariff) {
                                    updateLine(idx, {
                                      selectedTariffId: tariff.id,
                                      appliedRate: tariff.fixedFee.toString(),
                                    });
                                  }
                                }
                              }}
                              className="w-full border rounded px-2 py-1.5 text-xs text-gray-600 bg-gray-50 mb-1"
                            >
                              {tariffs
                                .filter((t) => t.utilityId === line.utilityId)
                                .sort((a, b) => new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime())
                                .map((t) => (
                                  <option key={t.id} value={t.id}>
                                    ₴{t.fixedFee.toFixed(2)} (from {new Date(t.effectiveFrom).toLocaleDateString()})
                                  </option>
                                ))}
                              <option value="custom">{t("createBill.customAmount")}</option>
                            </select>
                            {line.selectedTariffId === "custom" && (
                              <input
                                type="number"
                                step="0.01"
                                value={line.appliedRate}
                                onChange={(e) => updateLine(idx, { appliedRate: e.target.value })}
                                className="w-full border rounded px-3 py-1.5 text-sm"
                              />
                            )}
                          </div>
                        </div>
                      ) : (
                      <>
                        <div className="flex gap-2 mb-3">
                          <button
                            type="button"
                            onClick={() => updateLine(idx, { inputType: "MANUAL" })}
                            className={`px-3 py-1.5 rounded text-xs font-medium ${
                              line.inputType === "MANUAL"
                                ? "bg-gray-800 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {t("createBill.manual")}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateLine(idx, { inputType: "HA" });
                              loadHAImpReading(idx);
                            }}
                            disabled={!util.haEntityId}
                            className={`px-3 py-1.5 rounded text-xs font-medium ${
                              line.inputType === "HA"
                                ? "bg-purple-600 text-white"
                                : "bg-purple-50 text-purple-600 hover:bg-purple-100 disabled:opacity-40"
                            }`}
                          >
                            {t("createBill.homeAssistant")}
                          </button>
                          <button
                            type="button"
                            onClick={() => loadEstimate(idx)}
                            className={`px-3 py-1.5 rounded text-xs font-medium ${
                              line.inputType === "ESTIMATED"
                                ? "bg-orange-500 text-white"
                                : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                            }`}
                          >
                            {t("createBill.estimate")}
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">{t("createBill.previousReading")}</label>
                            <div className="flex gap-1">
                              <input
                                type="number"
                                step="0.1"
                                value={line.previousReading}
                                onChange={(e) => updateLine(idx, { previousReading: e.target.value })}
                                className="w-full border rounded px-3 py-1.5 text-sm"
                              />
                              {previousReadings[line.utilityId]?.length ? (
                                <select
                                  value={line.previousReading}
                                  onChange={(e) => updateLine(idx, { previousReading: e.target.value })}
                                  className="border rounded px-2 py-1.5 text-xs text-gray-600 bg-gray-50 min-w-[140px]"
                                >
                                  {previousReadings[line.utilityId].map((r) => (
                                    <option key={r.billingPeriod} value={r.value}>
                                      {r.value} ({r.billingPeriod})
                                    </option>
                                  ))}
                                </select>
                              ) : null}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">{t("createBill.currentReading")}</label>
                            <input
                              type="number"
                              step="0.1"
                              value={line.currentReading}
                              onChange={(e) => {
                                updateLine(idx, { currentReading: e.target.value });
                                const prev = parseFloat(line.previousReading || "0");
                                const curr = parseFloat(e.target.value || "0");
                                if (e.target.value && line.previousReading && curr < prev) {
                                  setValidationErrors((prev) => ({
                                    ...prev,
                                    [`${line.utilityId}-current`]: t("createBill.validationError"),
                                  }));
                                } else {
                                  setValidationErrors((prev) => {
                                    const next = { ...prev };
                                    delete next[`${line.utilityId}-current`];
                                    return next;
                                  });
                                }
                              }}
                              disabled={line.inputType === "HA"}
                              className={`w-full border rounded px-3 py-1.5 text-sm disabled:bg-gray-50 ${
                                validationErrors[`${line.utilityId}-current`]
                                  ? "border-red-500 bg-red-50"
                                  : ""
                              }`}
                            />
                            {validationErrors[`${line.utilityId}-current`] && (
                              <p className="text-xs text-red-600 mt-1">
                                {validationErrors[`${line.utilityId}-current`]}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">{t("createBill.consumption", { unit: util.unit || "unit" })}</label>
                            <div className="px-3 py-1.5 text-sm bg-gray-50 rounded border">
                              {(
                                (parseFloat(line.currentReading || "0") -
                                  parseFloat(line.previousReading || "0"))
                              ).toFixed(1)} {util.unit || "unit"}
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">{t("createBill.ratePerUnit", { unit: util.unit || "unit" })}</label>
                            <select
                              value={line.selectedTariffId}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "custom") {
                                  updateLine(idx, { selectedTariffId: "custom", appliedRate: "0" });
                                } else {
                                  const tariff = tariffs.find((t) => t.id === val);
                                  if (tariff) {
                                    updateLine(idx, {
                                      selectedTariffId: tariff.id,
                                      appliedRate: tariff.ratePerUnit.toString(),
                                    });
                                  }
                                }
                              }}
                              className="w-full border rounded px-2 py-1.5 text-xs text-gray-600 bg-gray-50 mb-1"
                            >
                              {tariffs
                                .filter((t) => t.utilityId === line.utilityId)
                                .sort((a, b) => new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime())
                                .map((t) => (
                                  <option key={t.id} value={t.id}>
                                    ₴{t.ratePerUnit.toFixed(4)} (from {new Date(t.effectiveFrom).toLocaleDateString()})
                                  </option>
                                ))}
                              <option value="custom">{t("createBill.customRate")}</option>
                            </select>
                            {line.selectedTariffId === "custom" && (
                              <input
                                type="number"
                                step="0.0001"
                                value={line.appliedRate}
                                onChange={(e) => updateLine(idx, { appliedRate: e.target.value })}
                                className="w-full border rounded px-3 py-1.5 text-sm"
                              />
                            )}
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">{t("createBill.cost")}</label>
                            <div className="px-3 py-1.5 text-sm bg-gray-50 rounded border">
                              ₴
                              {(
                                (parseFloat(line.currentReading || "0") -
                                  parseFloat(line.previousReading || "0")) *
                                parseFloat(line.appliedRate || "0")
                              ).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {line.inputType === "HA" && util.haEntityId && (
                          <div className="mt-2 text-xs text-purple-600">
                            {t("createBill.fetchingFrom")} <code>{util.haEntityId}</code>
                          </div>
                        )}
                        {line.inputType === "ESTIMATED" && (
                          <div className="mt-2 text-xs text-orange-600">
                            {t("createBill.estimatedReading")}
                          </div>
                        )}
                      </>
                    )
                    )}
                  </div>
                );
              })}
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
                className="border px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
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
