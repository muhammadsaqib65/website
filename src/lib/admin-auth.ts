import { db } from "@/db";
import { adminSessions } from "@/db/schema";
import { and, eq, gt, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "riwaayat_admin_session";
const SESSION_AGE_SECONDS = 60 * 60 * 24 * 7;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-admin-password";
  return { username, password };
}

export async function createAdminSession() {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_AGE_SECONDS * 1000);

  await db.insert(adminSessions).values({ tokenHash, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, rawToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_AGE_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (token) {
    await db
      .delete(adminSessions)
      .where(eq(adminSessions.tokenHash, hashToken(token)));
  }

  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!token) {
    return false;
  }

  const tokenHash = hashToken(token);
  const now = new Date();

  const rows = await db
    .select({ tokenHash: adminSessions.tokenHash })
    .from(adminSessions)
    .where(and(eq(adminSessions.tokenHash, tokenHash), gt(adminSessions.expiresAt, now)))
    .limit(1);

  if (rows.length === 0) {
    return false;
  }

  try {
    return timingSafeEqual(Buffer.from(rows[0].tokenHash), Buffer.from(tokenHash));
  } catch {
    return false;
  }
}

export async function cleanupExpiredAdminSessions() {
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
}
