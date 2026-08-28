import { sign, verify } from "hono/jwt";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export interface JwtPayload {
  sub: string;
  email: string;
  name: string | null;
}

export function signJwt(payload: JwtPayload): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30; // 30 days
  return sign({ ...payload, exp } as any, JWT_SECRET, "HS256");
}

export async function verifyJwt(token: string): Promise<JwtPayload> {
  const payload = await verify(token, JWT_SECRET, "HS256");
  return payload as unknown as JwtPayload;
}
