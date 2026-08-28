import { Context, Next } from "hono";
import { verifyJwt, JwtPayload } from "../lib/jwt";

declare module "hono" {
  interface ContextVariableMap {
    userId: string;
    userEmail: string;
    userName: string | null;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid authorization header" }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const payload: JwtPayload = await verifyJwt(token);
    c.set("userId", payload.sub);
    c.set("userEmail", payload.email);
    c.set("userName", payload.name);
    await next();
  } catch {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
}
