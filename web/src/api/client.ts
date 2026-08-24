const BASE = "/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  // Utilities
  getUtilities: () => request<import("../types").Utility[]>("/utilities"),
  getUtility: (id: string) => request<import("../types").Utility>(`/utilities/${id}`),
  createUtility: (data: Partial<import("../types").Utility>) =>
    request<import("../types").Utility>("/utilities", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateUtility: (id: string, data: Partial<import("../types").Utility>) =>
    request<import("../types").Utility>(`/utilities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteUtility: (id: string) =>
    request<{ ok: boolean }>(`/utilities/${id}`, { method: "DELETE" }),

  // Tariffs
  getTariffs: (utilityId?: string) => {
    const q = utilityId ? `?utilityId=${utilityId}` : "";
    return request<import("../types").TariffRate[]>(`/tariffs${q}`);
  },
  getCurrentTariff: (utilityId: string) =>
    request<import("../types").TariffRate>(`/tariffs/current/${utilityId}`),
  createTariff: (data: Partial<import("../types").TariffRate>) =>
    request<import("../types").TariffRate>("/tariffs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateTariff: (id: string, data: Partial<import("../types").TariffRate>) =>
    request<import("../types").TariffRate>(`/tariffs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteTariff: (id: string) =>
    request<{ ok: boolean }>(`/tariffs/${id}`, { method: "DELETE" }),

  // Bills
  getBills: () => request<import("../types").Bill[]>("/bills"),
  getBill: (id: string) => request<import("../types").BillWithItems>(`/bills/${id}`),
  createBill: (data: { billingPeriod: string; items: import("../types").BillItem[] }) =>
    request<import("../types").Bill>("/bills", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateBillStatus: (id: string, status: "PAID" | "UNPAID") =>
    request<import("../types").Bill>(`/bills/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  deleteBill: (id: string) =>
    request<{ ok: boolean }>(`/bills/${id}`, { method: "DELETE" }),

  // Readings
  getHAReading: (utilityId: string) =>
    request<import("../types").HAResponse>(`/readings/ha/${utilityId}`),
  getEstimate: (utilityId: string, previousReading: number, billingPeriod: string) =>
    request<import("../types").EstimateResult>(
      `/readings/estimate/${utilityId}?previousReading=${previousReading}&billingPeriod=${billingPeriod}`
    ),
  getPreviousReadings: (utilityId: string, limit = 3) =>
    request<{ value: number; billingPeriod: string }[]>(
      `/readings/previous/${utilityId}?limit=${limit}`
    ),
};
