import { useState, useEffect } from "react";
import { api } from "../../api/client";
import type { Utility } from "../../types";
import UtilityForm from "./UtilityForm";

export default function UtilitiesPage() {
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [editing, setEditing] = useState<Utility | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => api.getUtilities().then(setUtilities);
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this utility?")) return;
    await api.deleteUtility(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Utilities</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Add Utility
        </button>
      </div>

      {showForm && (
        <UtilityForm
          utility={editing}
          onSaved={() => { setShowForm(false); load(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Unit</th>
              <th className="px-4 py-3 font-medium">HA Entity</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {utilities.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{u.name}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    u.type === "CONSUMPTION" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                  }`}>
                    {u.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{u.unit || "—"}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{u.haEntityId || "—"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => { setEditing(u); setShowForm(true); }}
                    className="text-indigo-600 hover:text-indigo-800 text-xs mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600 hover:text-red-800 text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {utilities.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No utilities yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
