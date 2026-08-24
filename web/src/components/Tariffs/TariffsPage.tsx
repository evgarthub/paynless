import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import type { TariffRate, Utility } from "../../types";
import TariffForm from "./TariffForm";

export default function TariffsPage() {
  const { t } = useTranslation();
  const [tariffs, setTariffs] = useState<TariffRate[]>([]);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [editing, setEditing] = useState<TariffRate | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    api.getTariffs(filter || undefined).then(setTariffs);
    api.getUtilities().then(setUtilities);
  };
  useEffect(() => { load(); }, [filter]);

  const utilityName = (id: string) => utilities.find((u) => u.id === id)?.name ?? id;

  const handleDelete = async (id: string) => {
    if (!confirm(t("tariffs.deleteConfirm"))) return;
    await api.deleteTariff(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("tariffs.title")}</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          {t("tariffs.addTariff")}
        </button>
      </div>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">{t("tariffs.allUtilities")}</option>
          {utilities.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <TariffForm
          tariff={editing}
          utilities={utilities}
          onSaved={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">{t("tariffs.utility")}</th>
              <th className="px-4 py-3 font-medium">{t("tariffs.ratePerUnit")}</th>
              <th className="px-4 py-3 font-medium">{t("tariffs.fixedFee")}</th>
              <th className="px-4 py-3 font-medium">{t("tariffs.effectiveFrom")}</th>
              <th className="px-4 py-3 font-medium">{t("tariffs.reference")}</th>
              <th className="px-4 py-3 font-medium">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tariffs.map((tariff) => (
              <tr key={tariff.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{utilityName(tariff.utilityId)}</td>
                <td className="px-4 py-3">{tariff.ratePerUnit.toFixed(4)}</td>
                <td className="px-4 py-3">{tariff.fixedFee.toFixed(2)}</td>
                <td className="px-4 py-3">{new Date(tariff.effectiveFrom).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {tariff.referenceUrl ? (
                    <a href={tariff.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs">
                      {t("common.link")}
                    </a>
                  ) : (
                    <span className="text-gray-400">{t("common.noData")}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { setEditing(tariff); setShowForm(true); }}
                    className="text-indigo-600 hover:text-indigo-800 text-xs mr-3"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(tariff.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))}
            {tariffs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  {t("tariffs.emptyState")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
