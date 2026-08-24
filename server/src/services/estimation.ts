import { db } from "../db";
import { billItems } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import type { EstimateResult } from "../types";

export async function estimateReading(
  utilityId: string,
  previousReading: number,
  billingPeriod: string
): Promise<EstimateResult> {
  const history = await db
    .select()
    .from(billItems)
    .where(eq(billItems.utilityId, utilityId))
    .orderBy(desc(billItems.id))
    .limit(12);

  if (history.length === 0) {
    return { projectedReading: previousReading, dailyAvg: 0, daysElapsed: 0 };
  }

  let totalConsumption = 0;
  let count = 0;
  for (const item of history) {
    if (item.consumption != null && item.consumption > 0) {
      totalConsumption += item.consumption;
      count++;
    }
  }

  const dailyAvg = count > 0 ? totalConsumption / (count * 30) : 0;

  const [year, month] = billingPeriod.split("-").map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysElapsed = daysInMonth;

  const projectedReading = previousReading + dailyAvg * daysElapsed;

  return {
    projectedReading: Math.round(projectedReading * 1000) / 1000,
    dailyAvg: Math.round(dailyAvg * 1000) / 1000,
    daysElapsed,
  };
}
