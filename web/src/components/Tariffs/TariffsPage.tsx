import { useState, useEffect } from "react";
import { api } from "../../api/client";
import type { TariffRate, Utility } from "../../types";
import TariffForm from "./TariffForm";

export default function TariffsPage() {
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
    if (!confirm("Delete this tariff?")) return;
    await api.deleteTariff(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tariff Rates</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Add Tariff
        </button>
      </div>

      <div className="mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All utilities</option>
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
              <th className="px-4 py-3 font-medium">Utility</th>
              <th className="px-4 py-3 font-medium">Rate/Unit</th>
              <th className="px-4 py-3 font-medium">Fixed Fee</th>
              <th className="px-4 py-3 font-medium">Effective From</th>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tariffs.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{utilityName(t.utilityId)}</td>
                <td className="px-4 py-3">{t.ratePerUnit.toFixed(4)}</td>
                <td className="px-4 py-3">{t.fixedFee.toFixed(2)}</td>
                <td className="px-4 py-3">{new Date(t.effectiveFrom).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {t.referenceUrl ? (
                    <a href={t.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs">
                      Link
                    </a>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { setEditing(t); setShowForm(true); }}
                    className="text-indigo-600 hover:text-indigo-800 text-xs mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {tariffs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                  No tariff rates yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
