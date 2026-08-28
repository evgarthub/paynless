import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import type { Utility } from "../../types";
import UtilityForm from "./UtilityForm";

export default function UtilitiesPage() {
  const { t } = useTranslation();
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [editing, setEditing] = useState<Utility | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.getUtilities().then(setUtilities);
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm(t("utilities.deleteConfirm"))) return;
    await api.deleteUtility(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t("utilities.title")}</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          {t("utilities.addUtility")}
        </button>
      </div>

      {showForm && (
        <UtilityForm
          utility={editing}
          onSaved={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{t("utilities.name")}</th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{t("utilities.type")}</th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{t("utilities.unit")}</th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{t("utilities.haEntity")}</th>
              <th className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {utilities.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{u.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    u.type === "CONSUMPTION" ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  }`}>
                    {u.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{u.unit || t("common.noData")}</td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs">{u.haEntityId || t("common.noData")}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { setEditing(u); setShowForm(true); }}
                    className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs mr-3"
                  >
                    {t("common.edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs"
                  >
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))}
            {utilities.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  {t("utilities.emptyState")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
