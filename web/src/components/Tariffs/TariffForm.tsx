import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import type { TariffRate, Utility } from "../../types";

interface Props {
  tariff: TariffRate | null;
  utilities: Utility[];
  onSaved: () => void;
  onCancel: () => void;
}

export default function TariffForm({ tariff, utilities, onSaved, onCancel }: Props) {
  const { t } = useTranslation();
  const [utilityId, setUtilityId] = useState(tariff?.utilityId ?? (utilities[0]?.id ?? ""));
  const [ratePerUnit, setRatePerUnit] = useState(tariff?.ratePerUnit?.toString() ?? "0");
  const [fixedFee, setFixedFee] = useState(tariff?.fixedFee?.toString() ?? "0");
  const [referenceUrl, setReferenceUrl] = useState(tariff?.referenceUrl ?? "");
  const [effectiveFrom, setEffectiveFrom] = useState(
    tariff?.effectiveFrom
      ? new Date(tariff.effectiveFrom).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        utilityId,
        ratePerUnit: parseFloat(ratePerUnit),
        fixedFee: parseFloat(fixedFee),
        referenceUrl: referenceUrl || null,
        effectiveFrom,
      };
      if (tariff) {
        await api.updateTariff(tariff.id, data);
      } else {
        await api.createTariff(data);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{tariff ? t("tariffForm.editTariff") : t("tariffForm.newTariff")}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("tariffForm.utility")}</label>
          <select
            value={utilityId}
            onChange={(e) => setUtilityId(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {utilities.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("tariffForm.ratePerUnit")}</label>
          <input
            type="number"
            step="0.0001"
            value={ratePerUnit}
            onChange={(e) => setRatePerUnit(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("tariffForm.fixedFee")}</label>
          <input
            type="number"
            step="0.01"
            value={fixedFee}
            onChange={(e) => setFixedFee(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("tariffForm.effectiveFrom")}</label>
          <input
            type="date"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("tariffForm.referenceUrl")}</label>
          <input
            type="url"
            value={referenceUrl}
            onChange={(e) => setReferenceUrl(e.target.value)}
            placeholder={t("tariffForm.referencePlaceholder")}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? t("common.saving") : t("common.save")}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 dark:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          >
            {t("common.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
