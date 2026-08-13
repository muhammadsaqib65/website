import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

type ContactBody = {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function getClientIp() {
  const hdrs = await headers();
  const forwarded = hdrs.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return hdrs.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;
    const name = clean(body.name);
    const email = clean(body.email);
    const phone = clean(body.phone);
    const message = clean(body.message);

    if (!name || !email || !message) {
      return Response.json({ ok: false, message: "Name, email, and message are required." }, { status: 400 });
    }

    if (!isEmail(email)) {
      return Response.json({ ok: false, message: "Please provide a valid email address." }, { status: 400 });
    }

    if (name.length > 120 || email.length > 180 || phone.length > 40 || message.length > 2000) {
      return Response.json({ ok: false, message: "Input too long." }, { status: 400 });
    }

    const ip = await getClientIp();
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const recentCountResult = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(contactSubmissions)
      .where(
        and(
          gt(contactSubmissions.createdAt, twoMinutesAgo),
          eq(contactSubmissions.email, email),
        ),
      );

    if ((recentCountResult[0]?.count ?? 0) >= 3) {
      return Response.json(
        { ok: false, message: "Too many messages sent recently. Please wait and try again." },
        { status: 429 },
      );
    }

    await db.insert(contactSubmissions).values({
      name,
      email,
      phone: phone || null,
      message: `${message}\n\n[submitted-from-ip:${ip}]`,
    });

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, message: "Could not process message." }, { status: 500 });
  }
}

export async function GET() {
  const latest = await db
    .select({ id: contactSubmissions.id, createdAt: contactSubmissions.createdAt })
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(10);

  return Response.json({ ok: true, latest });
}
