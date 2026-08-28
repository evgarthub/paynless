import { Hono } from "hono";
import { db } from "../db";
import { bills, billItems, utilities } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import { fetchHAState } from "../services/ha";
import { estimateReading } from "../services/estimation";

const app = new Hono();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const all = db
    .select()
    .from(bills)
    .where(eq(bills.userId, userId))
    .orderBy(desc(bills.billingPeriod))
    .all();
  return c.json(all);
});

app.get("/:id", async (c) => {
  const userId = c.get("userId");
  const bill = db
    .select()
    .from(bills)
    .where(and(eq(bills.id, c.req.param("id")), eq(bills.userId, userId)))
    .get();
  if (!bill) return c.json({ error: "Not found" }, 404);
  const items = db.select().from(billItems).where(eq(billItems.billId, bill.id)).all();
  return c.json({ ...bill, items });
});

app.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const billId = nanoid();
  let totalAmount = 0;

  const items = [];

  for (const item of body.items) {
    const utility = db
      .select()
      .from(utilities)
      .where(and(eq(utilities.id, item.utilityId), eq(utilities.userId, userId)))
      .get();
    if (!utility) continue;

    let previousReading = item.previousReading ?? 0;
    let currentReading = item.currentReading ?? 0;
    let consumption = 0;
    let isEstimated = false;
    let totalCost = 0;

    if (utility.type === "FIXED") {
      totalCost = item.appliedRate;
    } else {
      if (item.inputType === "HA" && utility.haEntityId) {
        const state = await fetchHAState(utility.haEntityId);
        currentReading = parseFloat(state.state);
      } else if (item.inputType === "ESTIMATED") {
        const estimate = await estimateReading(
          userId,
          utility.id,
          previousReading,
          body.billingPeriod
        );
        currentReading = estimate.projectedReading;
        isEstimated = true;
      }

      consumption = Math.round((currentReading - previousReading) * 10) / 10;
      totalCost = consumption * item.appliedRate;
    }

    const roundedTotalCost = Math.round(totalCost * 100) / 100;
    const itemId = nanoid();
    items.push({
      id: itemId,
      billId,
      utilityId: utility.id,
      inputType: item.inputType,
      previousReading: Math.round(previousReading * 10) / 10,
      currentReading: Math.round(currentReading * 10) / 10,
      consumption: Math.round(consumption * 10) / 10,
      appliedRate: item.appliedRate,
      totalCost: roundedTotalCost,
      isEstimated,
    });
    totalAmount += roundedTotalCost;
  }

  db.insert(bills)
    .values({
      id: billId,
      userId,
      billingPeriod: body.billingPeriod,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: "UNPAID",
    })
    .run();

  for (const item of items) {
    db.insert(billItems).values(item).run();
  }

  const bill = db.select().from(bills).where(eq(bills.id, billId)).get();
  return c.json(bill, 201);
});

app.patch("/:id/status", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const row = db
    .update(bills)
    .set({ status: body.status })
    .where(and(eq(bills.id, c.req.param("id")), eq(bills.userId, userId)))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

app.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const row = db
    .delete(bills)
    .where(and(eq(bills.id, c.req.param("id")), eq(bills.userId, userId)))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({ ok: true });
});

export default app;
