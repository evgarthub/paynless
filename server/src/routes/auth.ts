import { Hono } from "hono";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { signJwt } from "../lib/jwt";

const app = new Hono();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.get("/google", (c) => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });
  return c.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
});

app.get("/google/callback", async (c) => {
  const code = c.req.query("code");
  if (!code) return c.json({ error: "Missing code parameter" }, 400);

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }).toString(),
  });

  if (!tokenRes.ok) {
    return c.json({ error: "Failed to exchange code for token" }, 401);
  }

  const tokens = await tokenRes.json();

  const userInfoRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    { headers: { Authorization: `Bearer ${tokens.access_token}` } }
  );

  if (!userInfoRes.ok) {
    return c.json({ error: "Failed to fetch user info" }, 401);
  }

  const googleUser = await userInfoRes.json();

  let user = db
    .select()
    .from(users)
    .where(eq(users.googleId, googleUser.id))
    .get();

  if (!user) {
    const id = nanoid();
    user = db
      .insert(users)
      .values({
        id,
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
      })
      .returning()
      .get();
  } else {
    user = db
      .update(users)
      .set({ name: googleUser.name, email: googleUser.email })
      .where(eq(users.id, user.id))
      .returning()
      .get()!;
  }

  const jwt = await signJwt({
    sub: user.id,
    email: user.email,
    name: user.name,
  });

  return c.redirect(`${FRONTEND_URL}/auth/callback?token=${encodeURIComponent(jwt)}`);
});

app.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Not authenticated" }, 401);
  }

  const { verifyJwt } = await import("../lib/jwt");
  try {
    const payload = await verifyJwt(authHeader.slice(7));
    const user = db
      .select({ id: users.id, email: users.email, name: users.name })
      .from(users)
      .where(eq(users.id, payload.sub))
      .get();
    if (!user) return c.json({ error: "User not found" }, 404);
    return c.json(user);
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
});

export default app;
