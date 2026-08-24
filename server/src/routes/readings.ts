import { Hono } from "hono";
import { db } from "../db";
import { utilities, billItems, bills } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { fetchHAState } from "../services/ha";
import { estimateReading } from "../services/estimation";

const app = new Hono();

app.get("/ha/:utilityId", async (c) => {
  const util = db
    .select()
    .from(utilities)
    .where(eq(utilities.id, c.req.param("utilityId")))
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
  const { utilityId } = c.req.param();
  const previousReading = parseFloat(c.req.query("previousReading") || "0");
  const billingPeriod = c.req.query("billingPeriod") || "";

  const estimate = await estimateReading(utilityId, previousReading, billingPeriod);
  return c.json(estimate);
});

app.get("/previous/:utilityId", async (c) => {
  const { utilityId } = c.req.param();
  const limit = parseInt(c.req.query("limit") || "3", 10);

  const items = db
    .select({
      currentReading: billItems.currentReading,
      billingPeriod: bills.billingPeriod,
    })
    .from(billItems)
    .innerJoin(bills, eq(billItems.billId, bills.id))
    .where(eq(billItems.utilityId, utilityId))
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
