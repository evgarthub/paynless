import { db } from "../db";
import { billItems, bills } from "../db/schema";
import { eq, and, inArray, desc } from "drizzle-orm";
import type { EstimateResult } from "../types";

export async function estimateReading(
  userId: string,
  utilityId: string,
  previousReading: number,
  billingPeriod: string
): Promise<EstimateResult> {
  const userBillIds = db
    .select({ id: bills.id })
    .from(bills)
    .where(eq(bills.userId, userId))
    .all()
    .map((b) => b.id);

  if (userBillIds.length === 0) {
    return { projectedReading: previousReading, dailyAvg: 0, daysElapsed: 0 };
  }

  const history = db
    .select()
    .from(billItems)
    .where(
      and(eq(billItems.utilityId, utilityId), inArray(billItems.billId, userBillIds))
    )
    .orderBy(desc(billItems.id))
    .limit(12)
    .all();

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
    projectedReading: Math.round(projectedReading * 10) / 10,
    dailyAvg: Math.round(dailyAvg * 10) / 10,
    daysElapsed,
  };
}
