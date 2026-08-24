import { useState, useEffect } from "react";
import { api } from "../../api/client";
import type { Utility, BillItem, TariffRate } from "../../types";

interface LineItemDraft {
  utilityId: string;
  inputType: "MANUAL" | "HA" | "ESTIMATED";
  previousReading: string;
  currentReading: string;
  appliedRate: string;
}

interface Props {
  onSaved: () => void;
  onCancel: () => void;
}

export default function CreateBillModal({ onSaved, onCancel }: Props) {
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [tariffs, setTariffs] = useState<TariffRate[]>([]);
  const [billingPeriod, setBillingPeriod] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [lines, setLines] = useState<LineItemDraft[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getUtilities().then((u) => {
      setUtilities(u);
      setLines(
        u.map((util) => ({
          utilityId: util.id,
          inputType: util.type === "FIXED" ? "MANUAL" as const : "MANUAL" as const,
          previousReading: "",
          currentReading: "",
          appliedRate: "0",
        }))
      );
    });
    api.getTariffs().then(setTariffs);
  }, []);

  const getRate = (utilityId: string): TariffRate | undefined => {
    return tariffs.find((t) => t.utilityId === utilityId);
  };

  const updateLine = (idx: number, patch: Partial<LineItemDraft>) => {
    setLines((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));
  };

  const loadHAImpReading = async (idx: number) => {
    const line = lines[idx];
    const util = utilities.find((u) => u.id === line.utilityId);
    if (!util?.haEntityId) return;
    try {
      const reading = await api.getHAReading(util.id);
      updateLine(idx, { currentReading: reading.value.toString() });
    } catch (err) {
      alert(`HA fetch failed: ${err}`);
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
      alert(`Estimation failed: ${err}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const items: BillItem[] = lines
        .filter((l) => {
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
              ? parseFloat(l.currentReading) - parseFloat(l.previousReading)
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
            <h2 className="text-xl font-bold">Create Bill</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Billing Period
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
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-semibold">{util.name}</span>
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

                    {util.type === "FIXED" ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Fixed Fee</label>
                          <input
                            type="number"
                            step="0.01"
                            value={line.appliedRate}
                            onChange={(e) => updateLine(idx, { appliedRate: e.target.value })}
                            className="w-full border rounded px-3 py-1.5 text-sm"
                          />
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
                            Manual
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
                            Home Assistant
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
                            Estimate
                          </button>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Previous Reading</label>
                            <input
                              type="number"
                              step="0.001"
                              value={line.previousReading}
                              onChange={(e) => updateLine(idx, { previousReading: e.target.value })}
                              className="w-full border rounded px-3 py-1.5 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Current Reading</label>
                            <input
                              type="number"
                              step="0.001"
                              value={line.currentReading}
                              onChange={(e) => updateLine(idx, { currentReading: e.target.value })}
                              disabled={line.inputType === "HA"}
                              className="w-full border rounded px-3 py-1.5 text-sm disabled:bg-gray-50"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Rate per {util.unit || "unit"}</label>
                            <input
                              type="number"
                              step="0.0001"
                              value={line.appliedRate}
                              onChange={(e) => updateLine(idx, { appliedRate: e.target.value })}
                              className="w-full border rounded px-3 py-1.5 text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Cost</label>
                            <div className="px-3 py-1.5 text-sm bg-gray-50 rounded border">
                              $
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
                            Fetching from: <code>{util.haEntityId}</code>
                          </div>
                        )}
                        {line.inputType === "ESTIMATED" && (
                          <div className="mt-2 text-xs text-orange-600">
                            Estimated reading based on historical average
                          </div>
                        )}
                      </>
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
                {saving ? "Creating..." : "Create Bill"}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="border px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
