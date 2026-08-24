import { Hono } from "hono";
import { db } from "../db";
import { utilities } from "../db/schema";
import { eq } from "drizzle-orm";
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

export default app;
