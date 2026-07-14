import crypto from "crypto";
import { cookies } from "next/headers";

// Minimal signed-cookie gate for DKKL staff (spec §10). A single shared password
// is fine for a small team; swap for per-user auth later if needed.

const COOKIE = "dkkl_admin";

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not set");
  return s;
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex");
}

// Token = issuedAt.signature — lets us both verify integrity and expire it.
export function createSessionToken(): string {
  const issued = String(Date.now());
  return `${issued}.${sign(issued)}`;
}

const MAX_AGE_SECONDS = 60 * 60 * 12; // 12h

function isValidToken(token: string | undefined): boolean {
  if (!token) return false;
  const [issued, sig] = token.split(".");
  if (!issued || !sig) return false;
  const expected = sign(issued);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const ageMs = Date.now() - Number(issued);
  return ageMs >= 0 && ageMs < MAX_AGE_SECONDS * 1000;
}

export const ADMIN_COOKIE = COOKIE;
export const ADMIN_COOKIE_MAX_AGE = MAX_AGE_SECONDS;

// For use in Server Components / route handlers (cookies() is async in Next 16).
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return isValidToken(jar.get(COOKIE)?.value);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
