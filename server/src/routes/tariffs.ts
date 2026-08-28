import { Hono } from "hono";
import { db } from "../db";
import { tariffRates, utilities } from "../db/schema";
import { eq, and, lte, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

const app = new Hono();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const utilityId = c.req.query("utilityId");

  const userUtilities = db
    .select({ id: utilities.id })
    .from(utilities)
    .where(eq(utilities.userId, userId))
    .all();
  const userUtilityIds = new Set(userUtilities.map((u) => u.id));

  let rows;
  if (utilityId) {
    if (!userUtilityIds.has(utilityId)) {
      return c.json({ error: "Not found" }, 404);
    }
    rows = db
      .select()
      .from(tariffRates)
      .where(eq(tariffRates.utilityId, utilityId))
      .orderBy(desc(tariffRates.effectiveFrom))
      .all();
  } else {
    rows = db.select().from(tariffRates).orderBy(desc(tariffRates.effectiveFrom)).all();
    rows = rows.filter((r) => userUtilityIds.has(r.utilityId));
  }
  return c.json(rows);
});

app.get("/current/:utilityId", async (c) => {
  const userId = c.get("userId");
  const utilityId = c.req.param("utilityId");

  const util = db
    .select()
    .from(utilities)
    .where(and(eq(utilities.id, utilityId), eq(utilities.userId, userId)))
    .get();
  if (!util) return c.json({ error: "Not found" }, 404);

  const now = new Date();
  const row = db
    .select()
    .from(tariffRates)
    .where(
      and(
        eq(tariffRates.utilityId, utilityId),
        lte(tariffRates.effectiveFrom, now)
      )
    )
    .orderBy(desc(tariffRates.effectiveFrom))
    .limit(1)
    .get();
  if (!row) return c.json({ error: "No active tariff" }, 404);
  return c.json(row);
});

app.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();

  const util = db
    .select()
    .from(utilities)
    .where(and(eq(utilities.id, body.utilityId), eq(utilities.userId, userId)))
    .get();
  if (!util) return c.json({ error: "Utility not found" }, 404);

  const id = nanoid();
  const row = db
    .insert(tariffRates)
    .values({
      id,
      utilityId: body.utilityId,
      ratePerUnit: body.ratePerUnit ?? 0,
      fixedFee: body.fixedFee ?? 0,
      referenceUrl: body.referenceUrl ?? null,
      effectiveFrom: new Date(body.effectiveFrom),
    })
    .returning()
    .get();
  return c.json(row, 201);
});

app.put("/:id", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();

  const existing = db
    .select()
    .from(tariffRates)
    .where(eq(tariffRates.id, c.req.param("id")))
    .get();
  if (!existing) return c.json({ error: "Not found" }, 404);

  const util = db
    .select()
    .from(utilities)
    .where(and(eq(utilities.id, existing.utilityId), eq(utilities.userId, userId)))
    .get();
  if (!util) return c.json({ error: "Not found" }, 404);

  const row = db
    .update(tariffRates)
    .set({
      ratePerUnit: body.ratePerUnit ?? 0,
      fixedFee: body.fixedFee ?? 0,
      referenceUrl: body.referenceUrl ?? null,
      effectiveFrom: new Date(body.effectiveFrom),
    })
    .where(eq(tariffRates.id, c.req.param("id")))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

app.delete("/:id", async (c) => {
  const userId = c.get("userId");

  const existing = db
    .select()
    .from(tariffRates)
    .where(eq(tariffRates.id, c.req.param("id")))
    .get();
  if (!existing) return c.json({ error: "Not found" }, 404);

  const util = db
    .select()
    .from(utilities)
    .where(and(eq(utilities.id, existing.utilityId), eq(utilities.userId, userId)))
    .get();
  if (!util) return c.json({ error: "Not found" }, 404);

  const row = db
    .delete(tariffRates)
    .where(eq(tariffRates.id, c.req.param("id")))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({ ok: true });
});

export default app;
