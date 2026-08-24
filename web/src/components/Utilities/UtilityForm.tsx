import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import type { Utility } from "../../types";

interface Props {
  utility: Utility | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function UtilityForm({ utility, onSaved, onCancel }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState(utility?.name ?? "");
  const [type, setType] = useState<"CONSUMPTION" | "FIXED">(utility?.type ?? "CONSUMPTION");
  const [unit, setUnit] = useState(utility?.unit ?? "");
  const [haEntityId, setHaEntityId] = useState(utility?.haEntityId ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        name,
        type,
        unit: unit || null,
        haEntityId: haEntityId || null,
      };
      if (utility) {
        await api.updateUtility(utility.id, data);
      } else {
        await api.createUtility(data);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">{utility ? t("utilityForm.editUtility") : t("utilityForm.newUtility")}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("utilityForm.name")}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("utilityForm.type")}</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "CONSUMPTION" | "FIXED")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option value="CONSUMPTION">{t("utilityForm.consumption")}</option>
            <option value="FIXED">{t("utilityForm.fixed")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("utilityForm.unit")}</label>
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder={t("utilityForm.unitPlaceholder")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("utilityForm.haEntityId")}</label>
          <input
            value={haEntityId}
            onChange={(e) => setHaEntityId(e.target.value)}
            placeholder={t("utilityForm.haEntityPlaceholder")}
            className="w-full border rounded-lg px-3 py-2 text-sm font-mono"
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
            className="border px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            {t("common.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
