import { Hono } from "hono";
import { db } from "../db";
import { utilities } from "../db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

const app = new Hono();

app.get("/", async (c) => {
  const all = db.select().from(utilities).all();
  return c.json(all);
});

app.get("/:id", async (c) => {
  const row = db.select().from(utilities).where(eq(utilities.id, c.req.param("id"))).get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

app.post("/", async (c) => {
  const body = await c.req.json();
  const id = nanoid();
  const row = db
    .insert(utilities)
    .values({
      id,
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
  const body = await c.req.json();
  const row = db
    .update(utilities)
    .set({
      name: body.name,
      type: body.type,
      unit: body.unit ?? null,
      haEntityId: body.haEntityId ?? null,
    })
    .where(eq(utilities.id, c.req.param("id")))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json(row);
});

app.delete("/:id", async (c) => {
  const row = db
    .delete(utilities)
    .where(eq(utilities.id, c.req.param("id")))
    .returning()
    .get();
  if (!row) return c.json({ error: "Not found" }, 404);
  return c.json({ ok: true });
});

export default app;
