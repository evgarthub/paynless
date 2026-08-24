import { sendHANotification } from "./ha";

const HA_NOTIFY_SERVICE = process.env.HA_NOTIFY_SERVICE || "mobile_app";
const CRON_SCHEDULE = process.env.CRON_SCHEDULE || "0 9 1 * *";

function parseCron(expr: string): { month: number; day: number; hour: number } {
  const parts = expr.trim().split(/\s+/);
  return {
    hour: parts[0] === "*" ? -1 : parseInt(parts[0], 10),
    day: parts[1] === "*" ? -1 : parseInt(parts[1], 10),
    month: parts[2] === "*" ? -1 : parseInt(parts[2], 10),
  };
}

function matchesSchedule(now: Date, schedule: ReturnType<typeof parseCron>): boolean {
  if (schedule.month !== -1 && now.getMonth() + 1 !== schedule.month) return false;
  if (schedule.day !== -1 && now.getDate() !== schedule.day) return false;
  if (schedule.hour !== -1 && now.getHours() !== schedule.hour) return false;
  return true;
}

let lastRun = "";

export function startCronWorker(): void {
  const schedule = parseCron(CRON_SCHEDULE);

  const interval = setInterval(async () => {
    const now = new Date();
    const key = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;

    if (lastRun === key) return;
    if (!matchesSchedule(now, schedule)) return;

    lastRun = key;

    try {
      const monthName = now.toLocaleString("default", { month: "long" });
      const year = now.getFullYear();
      await sendHANotification(
        HA_NOTIFY_SERVICE,
        `Don't forget to submit your ${monthName} ${year} utility bills!`,
        "Paynless Reminder"
      );
      console.log(`[CRON] Reminder sent for ${monthName} ${year}`);
    } catch (err) {
      console.error("[CRON] Failed to send reminder:", err);
    }
  }, 60_000);

  console.log(`[CRON] Worker started (schedule: ${CRON_SCHEDULE})`);
}
