import { useState, useEffect, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../../api/client";
import type { Bill, BillWithItems, Utility } from "../../types";
import CreateBillModal from "./CreateBillModal";

export default function BillsPage() {
  const { t } = useTranslation();
  const [bills, setBills] = useState<Bill[]>([]);
  const [expanded, setExpanded] = useState<BillWithItems[]>([]);
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => api.getBills().then(setBills);
  useEffect(() => { load(); api.getUtilities().then(setUtilities); }, []);

  const utilityName = (id: string) => utilities.find((u) => u.id === id)?.name ?? id;

  const toggleExpand = async (bill: Bill) => {
    const isExpanded = expanded.some((e) => e.id === bill.id);
    if (isExpanded) {
      setExpanded((prev) => prev.filter((e) => e.id !== bill.id));
    } else {
      const billWithItems = await api.getBill(bill.id);
      setExpanded((prev) => {
        const next = [...prev, billWithItems];
        return next.length > 2 ? next.slice(1) : next;
      });
    }
  };

  const toggleStatus = async (bill: Bill) => {
    const newStatus = bill.status === "PAID" ? "UNPAID" : "PAID";
    await api.updateBillStatus(bill.id, newStatus);
    load();
    setExpanded((prev) =>
      prev.map((e) => (e.id === bill.id ? { ...e, status: newStatus } : e))
    );
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t("bills.deleteConfirm"))) return;
    await api.deleteBill(id);
    setExpanded((prev) => prev.filter((e) => e.id !== id));
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t("bills.title")}</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
        >
          {t("bills.createBill")}
        </button>
      </div>

      {showCreate && (
        <CreateBillModal
          onSaved={() => { setShowCreate(false); load(); }}
          onCancel={() => setShowCreate(false)}
        />
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">{t("bills.period")}</th>
              <th className="px-4 py-3 font-medium">{t("bills.total")}</th>
              <th className="px-4 py-3 font-medium">{t("bills.status")}</th>
              <th className="px-4 py-3 font-medium">{t("common.actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bills.map((b) => {
              const isExpanded = expanded.some((e) => e.id === b.id);
              const expandedData = expanded.find((e) => e.id === b.id);
              return (
                <Fragment key={b.id}>
                  <tr
                    className={`hover:bg-gray-50 cursor-pointer ${isExpanded ? "bg-indigo-50" : ""}`}
                    onClick={() => toggleExpand(b)}
                  >
                    <td
                      className="px-4 py-3 font-medium"
                      title={b.createdAt ? new Date(b.createdAt).toLocaleString() : undefined}
                    >
                      {b.billingPeriod}
                    </td>
                    <td className="px-4 py-3">₴{b.totalAmount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          b.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.status === "PAID" ? t("bills.paid") : t("bills.unpaid")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStatus(b); }}
                        className="text-indigo-600 hover:text-indigo-800 text-xs mr-3"
                      >
                        {t("bills.toggle")}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        {t("common.delete")}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && expandedData && (
                    <tr>
                      <td colSpan={4} className="px-4 py-4 bg-gray-50">
                        <div className="mb-3 flex items-center gap-4">
                          <span className="text-lg font-bold">₴{expandedData.totalAmount.toFixed(2)}</span>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              expandedData.status === "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {expandedData.status === "PAID" ? t("bills.paid") : t("bills.unpaid")}
                          </span>
                        </div>
                        <table className="w-full text-sm">
                          <thead className="text-left text-gray-500 border-b">
                            <tr>
                              <th className="pb-2 font-medium">{t("bills.utility")}</th>
                              <th className="pb-2 font-medium">{t("bills.input")}</th>
                              <th className="pb-2 font-medium">{t("bills.previous")}</th>
                              <th className="pb-2 font-medium">{t("bills.current")}</th>
                              <th className="pb-2 font-medium">{t("bills.consumption")}</th>
                              <th className="pb-2 font-medium">{t("bills.rate")}</th>
                              <th className="pb-2 font-medium">{t("bills.cost")}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {expandedData.items.map((item) => (
                              <tr key={item.id}>
                                <td className="py-2 font-medium">{utilityName(item.utilityId)}</td>
                                <td className="py-2">
                                  <span className={`px-2 py-0.5 rounded text-xs ${
                                    item.inputType === "HA"
                                      ? "bg-purple-100 text-purple-700"
                                      : item.inputType === "ESTIMATED"
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}>
                                    {item.inputType}
                                    {item.isEstimated && ` ${t("bills.estimated")}`}
                                  </span>
                                </td>
                                <td className="py-2">{item.previousReading != null ? item.previousReading.toFixed(1) : t("common.noData")}</td>
                                <td className="py-2">{item.currentReading != null ? item.currentReading.toFixed(1) : t("common.noData")}</td>
                                <td className="py-2">{item.consumption != null ? item.consumption.toFixed(1) : t("common.noData")}</td>
                                <td className="py-2">{item.appliedRate.toFixed(4)}</td>
                                <td className="py-2 font-medium">₴{item.totalCost.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {bills.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-400">
                  {t("bills.emptyState")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
