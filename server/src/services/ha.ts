import type { HAResponse } from "../types";

const HA_URL = process.env.HA_URL || "";
const HA_TOKEN = process.env.HA_TOKEN || "";

export async function fetchHAState(entityId: string): Promise<HAResponse> {
  const res = await fetch(`${HA_URL}/api/states/${entityId}`, {
    headers: {
      Authorization: `Bearer ${HA_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `HA API error: ${res.status} ${await res.text()}`
    );
  }

  return res.json() as Promise<HAResponse>;
}

export async function sendHANotification(
  service: string,
  message: string,
  title = "Paynless Reminder"
): Promise<void> {
  const res = await fetch(`${HA_URL}/api/services/notify/${service}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HA_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, title }),
  });

  if (!res.ok) {
    throw new Error(
      `HA Notify error: ${res.status} ${await res.text()}`
    );
  }
}
