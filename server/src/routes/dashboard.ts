import { Hono } from "hono";
import { db } from "../db";
import { bills, billItems, utilities } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";

const app = new Hono();

app.get("/summary", async (c) => {
  const userId = c.get("userId");
  const period =
    c.req.query("period") ||
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  const [year, month] = period.split("-").map(Number);
  const periodStart = `${year}-${String(month).padStart(2, "0")}`;
  const periodEnd =
    month === 12
      ? `${year + 1}-01`
      : `${year}-${String(month + 1).padStart(2, "0")}`;
  const prevMonth =
    month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;

  const allBills = db
    .select()
    .from(bills)
    .where(eq(bills.userId, userId))
    .orderBy(desc(bills.billingPeriod))
    .all();

  const currentMonthBills = allBills.filter(
    (b) => b.billingPeriod >= periodStart && b.billingPeriod < periodEnd
  );
  const prevMonthBills = allBills.filter(
    (b) => b.billingPeriod >= prevMonth && b.billingPeriod < periodStart
  );

  const totalSpentThisMonth = currentMonthBills.reduce(
    (s, b) => s + b.totalAmount,
    0
  );
  const prevMonthTotal = prevMonthBills.reduce(
    (s, b) => s + b.totalAmount,
    0
  );

  const currentYear = `${year}-01`;
  const nextYear = `${year + 1}-01`;
  const ytdBills = allBills.filter(
    (b) => b.billingPeriod >= currentYear && b.billingPeriod < nextYear
  );
  const totalSpentYTD = ytdBills.reduce((s, b) => s + b.totalAmount, 0);

  const unpaidBills = allBills.filter((b) => b.status === "UNPAID");
  const unpaidTotal = unpaidBills.reduce((s, b) => s + b.totalAmount, 0);

  const last12 = allBills.slice(0, 12);
  const avgMonthlyCost =
    last12.length > 0
      ? last12.reduce((s, b) => s + b.totalAmount, 0) / last12.length
      : 0;

  const costTrend =
    prevMonthTotal > 0
      ? ((totalSpentThisMonth - prevMonthTotal) / prevMonthTotal) * 100
      : 0;

  return c.json({
    totalSpentThisMonth: Math.round(totalSpentThisMonth * 100) / 100,
    totalSpentYTD: Math.round(totalSpentYTD * 100) / 100,
    unpaidTotal: Math.round(unpaidTotal * 100) / 100,
    unpaidCount: unpaidBills.length,
    avgMonthlyCost: Math.round(avgMonthlyCost * 100) / 100,
    billCount: allBills.length,
    costTrend: Math.round(costTrend * 10) / 10,
  });
});

app.get("/spending", async (c) => {
  const userId = c.get("userId");
  const from = c.req.query("from") || "2000-01";
  const to = c.req.query("to") || "2099-12";
  const groupBy = c.req.query("groupBy") || "period";

  const allBills = db
    .select()
    .from(bills)
    .where(eq(bills.userId, userId))
    .orderBy(desc(bills.billingPeriod))
    .all();
  const filtered = allBills.filter(
    (b) => b.billingPeriod >= from && b.billingPeriod <= to
  );

  const allItems = db.select().from(billItems).all();
  const allUtilities = db
    .select()
    .from(utilities)
    .where(eq(utilities.userId, userId))
    .all();
  const utilityMap = new Map(allUtilities.map((u) => [u.id, u]));

  if (groupBy === "utility") {
    const byUtility = new Map<
      string,
      { totalConsumption: number; totalCost: number }
    >();

    for (const bill of filtered) {
      const items = allItems.filter((i) => i.billId === bill.id);
      for (const item of items) {
        const existing = byUtility.get(item.utilityId) || {
          totalConsumption: 0,
          totalCost: 0,
        };
        existing.totalConsumption += item.consumption || 0;
        existing.totalCost += item.totalCost;
        byUtility.set(item.utilityId, existing);
      }
    }

    const result = Array.from(byUtility.entries()).map(([utilityId, data]) => {
      const util = utilityMap.get(utilityId);
      return {
        utilityId,
        name: util?.name || "Unknown",
        unit: util?.unit,
        totalConsumption: Math.round(data.totalConsumption * 10) / 10,
        totalCost: Math.round(data.totalCost * 100) / 100,
      };
    });

    return c.json(result);
  }

  const byPeriod = new Map<
    string,
    { total: number; byUtility: Map<string, number> }
  >();

  for (const bill of filtered) {
    const existing = byPeriod.get(bill.billingPeriod) || {
      total: 0,
      byUtility: new Map(),
    };
    existing.total += bill.totalAmount;

    const items = allItems.filter((i) => i.billId === bill.id);
    for (const item of items) {
      const prev = existing.byUtility.get(item.utilityId) || 0;
      existing.byUtility.set(item.utilityId, prev + item.totalCost);
    }
    byPeriod.set(bill.billingPeriod, existing);
  }

  const result = Array.from(byPeriod.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([period, data]) => ({
      period,
      total: Math.round(data.total * 100) / 100,
      byUtility: Array.from(data.byUtility.entries()).map(
        ([utilityId, amount]) => ({
          utilityId,
          name: utilityMap.get(utilityId)?.name || "Unknown",
          amount: Math.round(amount * 100) / 100,
        })
      ),
    }));

  return c.json(result);
});

app.get("/consumption-trend", async (c) => {
  const userId = c.get("userId");
  const utilityId = c.req.query("utilityId");
  const from = c.req.query("from") || "2000-01";
  const to = c.req.query("to") || "2099-12";

  if (!utilityId) {
    return c.json({ error: "utilityId is required" }, 400);
  }

  const util = db
    .select()
    .from(utilities)
    .where(and(eq(utilities.id, utilityId), eq(utilities.userId, userId)))
    .get();
  if (!util) return c.json({ error: "Not found" }, 404);

  const allBills = db
    .select()
    .from(bills)
    .where(eq(bills.userId, userId))
    .orderBy(desc(bills.billingPeriod))
    .all();
  const filtered = allBills.filter(
    (b) => b.billingPeriod >= from && b.billingPeriod <= to
  );

  const allItems = db.select().from(billItems).all();

  const result = filtered
    .map((bill) => {
      const item = allItems.find(
        (i) => i.billId === bill.id && i.utilityId === utilityId
      );
      return {
        period: bill.billingPeriod,
        consumption: item?.consumption || 0,
        cost: item?.totalCost || 0,
        unit: util.unit,
      };
    })
    .filter((r) => r.consumption > 0 || r.cost > 0)
    .sort((a, b) => a.period.localeCompare(b.period));

  return c.json(result);
});

app.get("/spending-by-type", async (c) => {
  const userId = c.get("userId");
  const from = c.req.query("from") || "2000-01";
  const to = c.req.query("to") || "2099-12";

  const allBills = db
    .select()
    .from(bills)
    .where(eq(bills.userId, userId))
    .orderBy(desc(bills.billingPeriod))
    .all();
  const filtered = allBills.filter(
    (b) => b.billingPeriod >= from && b.billingPeriod <= to
  );

  const allItems = db.select().from(billItems).all();
  const allUtilities = db
    .select()
    .from(utilities)
    .where(eq(utilities.userId, userId))
    .all();
  const utilityTypeMap = new Map(allUtilities.map((u) => [u.id, u.type]));

  let consumption = 0;
  let fixed = 0;

  for (const bill of filtered) {
    const items = allItems.filter((i) => i.billId === bill.id);
    for (const item of items) {
      const type = utilityTypeMap.get(item.utilityId);
      if (type === "FIXED") {
        fixed += item.totalCost;
      } else {
        consumption += item.totalCost;
      }
    }
  }

  return c.json({
    consumption: Math.round(consumption * 100) / 100,
    fixed: Math.round(fixed * 100) / 100,
  });
});

app.get("/year-comparison", async (c) => {
  const userId = c.get("userId");
  const utilityId = c.req.query("utilityId");

  if (!utilityId) {
    return c.json({ error: "utilityId is required" }, 400);
  }

  const util = db
    .select()
    .from(utilities)
    .where(and(eq(utilities.id, utilityId), eq(utilities.userId, userId)))
    .get();
  if (!util) return c.json({ error: "Not found" }, 404);

  const allBills = db
    .select()
    .from(bills)
    .where(eq(bills.userId, userId))
    .orderBy(desc(bills.billingPeriod))
    .all();

  const allItems = db.select().from(billItems).all();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const now = new Date();
  const years = new Set<number>();
  const byMonth = new Map<number, Map<number, number>>();

  for (const bill of allBills) {
    const [y, m] = bill.billingPeriod.split("-").map(Number);
    const item = allItems.find(
      (i) => i.billId === bill.id && i.utilityId === utilityId
    );
    if (!item) continue;

    years.add(y);
    if (!byMonth.has(m)) byMonth.set(m, new Map());
    byMonth.get(m)!.set(y, (byMonth.get(m)!.get(y) || 0) + (item.consumption || 0));
  }

  const sortedYears = [...years].sort();
  const result = monthNames.map((name, i) => {
    const m = i + 1;
    const yearData = byMonth.get(m);
    return {
      month: name,
      monthIndex: i,
      years: sortedYears.map((y) => ({
        year: y,
        consumption: Math.round((yearData?.get(y) || 0) * 10) / 10,
      })),
    };
  });

  return c.json(result);
});

export default app;
