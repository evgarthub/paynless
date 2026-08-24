import { useState, useEffect } from "react";
import { api } from "../../api/client";
import type { Bill, BillWithItems } from "../../types";
import CreateBillModal from "./CreateBillModal";

export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selected, setSelected] = useState<BillWithItems | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => api.getBills().then(setBills);
  useEffect(() => { load(); }, []);

  const toggleStatus = async (bill: Bill) => {
    const newStatus = bill.status === "PAID" ? "UNPAID" : "PAID";
    await api.updateBillStatus(bill.id, newStatus);
    load();
    if (selected?.id === bill.id) {
      setSelected({ ...selected, status: newStatus });
    }
  };

  const viewBill = async (id: string) => {
    const bill = await api.getBill(id);
    setSelected(bill);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bill?")) return;
    await api.deleteBill(id);
    setSelected(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bills</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          + Create Bill
        </button>
      </div>

      {showCreate && (
        <CreateBillModal
          onSaved={() => { setShowCreate(false); load(); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`${selected ? "lg:col-span-1" : "lg:col-span-3"}`}>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Period</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bills.map((b) => (
                  <tr
                    key={b.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selected?.id === b.id ? "bg-indigo-50" : ""
                    }`}
                    onClick={() => viewBill(b.id)}
                  >
                    <td className="px-4 py-3 font-medium">{b.billingPeriod}</td>
                    <td className="px-4 py-3">${b.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          b.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStatus(b); }}
                        className="text-indigo-600 hover:text-indigo-800 text-xs mr-3"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {bills.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                      No bills yet. Create your first bill.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {selected.billingPeriod} Bill Details
                </h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 text-sm"
                >
                  Close
                </button>
              </div>
              <div className="mb-4 flex items-center gap-4">
                <span className="text-2xl font-bold">${selected.totalAmount.toFixed(2)}</span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    selected.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {selected.status}
                </span>
              </div>
              <table className="w-full text-sm">
                <thead className="text-left text-gray-500 border-b">
                  <tr>
                    <th className="pb-2 font-medium">Utility</th>
                    <th className="pb-2 font-medium">Input</th>
                    <th className="pb-2 font-medium">Previous</th>
                    <th className="pb-2 font-medium">Current</th>
                    <th className="pb-2 font-medium">Consumption</th>
                    <th className="pb-2 font-medium">Rate</th>
                    <th className="pb-2 font-medium">Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selected.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 font-medium">{item.utilityId}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          item.inputType === "HA"
                            ? "bg-purple-100 text-purple-700"
                            : item.inputType === "ESTIMATED"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-700"
                        }`}>
                          {item.inputType}
                          {item.isEstimated && " (est.)"}
                        </span>
                      </td>
                      <td className="py-2">{item.previousReading ?? "—"}</td>
                      <td className="py-2">{item.currentReading ?? "—"}</td>
                      <td className="py-2">{item.consumption ?? "—"}</td>
                      <td className="py-2">{item.appliedRate.toFixed(4)}</td>
                      <td className="py-2 font-medium">${item.totalCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
