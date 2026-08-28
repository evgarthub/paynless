import { Hono } from "hono";
import { db } from "../db";
import { utilities } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { nanoid } from "nanoid";

const app = new Hono();

app.get("/", async (c) => {
  const userId = c.get("userId");
  const all = db
    .select()
    .from(utilities)
    .where(eq(utilities.userId, userId))
    .all();
  return c.json(all);
});

app.get("/:id", async (c) => {
  const userId = c.get("userId");
  const row = db
    .select()
    .from(utilities)
    .where(and(eq(utilities.id, c.req.param("id")), eq(utilities.userId, userId)))
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

app.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const id = nanoid();
  const row = db
    .insert(utilities)
    .values({
      id,
      userId,
      name: body.name,
      type: body.type,
      unit: body.unit ?? null,
      haEntityId: body.haEntityId ?? null,
    })
    .returning()
    .get();
  return c.json(row, 201);
});

app.put("/:id", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();
  const row = db
    .update(utilities)
    .set({
      name: body.name,
      type: body.type,
      unit: body.unit ?? null,
      haEntityId: body.haEntityId ?? null,
    })
    .where(and(eq(utilities.id, c.req.param("id")), eq(utilities.userId, userId)))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

app.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const row = db
    .delete(utilities)
    .where(and(eq(utilities.id, c.req.param("id")), eq(utilities.userId, userId)))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({ ok: true });
});

export default app;
