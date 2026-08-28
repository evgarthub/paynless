import { Hono } from "hono";
import { db } from "../db";
import { utilities, billItems, bills } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { fetchHAState } from "../services/ha";
import { estimateReading } from "../services/estimation";

const app = new Hono();

app.get("/ha/:utilityId", async (c) => {
  const userId = c.get("userId");
  const util = db
    .select()
    .from(utilities)
    .where(and(eq(utilities.id, c.req.param("utilityId")), eq(utilities.userId, userId)))
    .get();
  if (!util) return c.json({ error: "Utility not found" }, 404);
  if (!util.haEntityId) return c.json({ error: "No HA entity configured" }, 400);

  const state = await fetchHAState(util.haEntityId);
  return c.json({
    entityId: util.haEntityId,
    value: parseFloat(state.state),
    unit: util.unit,
    lastChanged: state.last_changed,
  });
});

app.get("/estimate/:utilityId", async (c) => {
  const userId = c.get("userId");
  const { utilityId } = c.req.param();
  const previousReading = parseFloat(c.req.query("previousReading") || "0");
  const billingPeriod = c.req.query("billingPeriod") || "";

  const estimate = await estimateReading(userId, utilityId, previousReading, billingPeriod);
  return c.json(estimate);
});

app.get("/previous/:utilityId", async (c) => {
  const userId = c.get("userId");
  const { utilityId } = c.req.param();
  const limit = parseInt(c.req.query("limit") || "3", 10);

  const items = db
    .select({
      currentReading: billItems.currentReading,
      billingPeriod: bills.billingPeriod,
    })
    .from(billItems)
    .innerJoin(bills, eq(billItems.billId, bills.id))
    .where(and(eq(billItems.utilityId, utilityId), eq(bills.userId, userId)))
    .orderBy(desc(bills.billingPeriod))
    .limit(limit)
    .all();

  const readings = items
    .filter((item) => item.currentReading !== null)
    .map((item) => ({
      value: item.currentReading,
      billingPeriod: item.billingPeriod,
    }));

  return c.json(readings);
});

export default app;
