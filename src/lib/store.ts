import { db } from "@/db";
import { contactSubmissions, orders, products, siteSettings } from "@/db/schema";
import { and, desc, eq, ne, sql } from "drizzle-orm";

export async function getOrCreateSiteSettings() {
  const existing = await db.select().from(siteSettings).limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const created = await db
    .insert(siteSettings)
    .values({})
    .returning();

  return created[0];
}

export async function getPublicProducts() {
  return db
    .select()
    .from(products)
    .where(and(eq(products.isActive, true)))
    .orderBy(desc(products.createdAt));
}

export async function getAdminProducts() {
  return db.select().from(products).orderBy(desc(products.createdAt));
}

export async function getSummerProducts() {
  const all = await getPublicProducts();
  return all.filter((p) => /summer/i.test(p.category) || /summer/i.test(p.name));
}

export async function getHandmadeProducts() {
  const all = await getPublicProducts();
  return all.filter(
    (p) => /hand\s*made/i.test(p.category) || /hand\s*made/i.test(p.name) || /hand\s*made/i.test(p.description),
  );
}

export async function getRecentContactSubmissions() {
  return db
    .select()
    .from(contactSubmissions)
    .orderBy(desc(contactSubmissions.createdAt))
    .limit(20);
}

export async function getRecentOrders() {
  return db.select().from(orders).orderBy(desc(orders.createdAt)).limit(30);
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createUniqueSlug(name: string, currentProductId?: number) {
  const base = slugify(name) || "product";
  let candidate = base;
  let counter = 1;

  for (;;) {
    const duplicate = await db
      .select({ id: products.id })
      .from(products)
      .where(
        currentProductId
          ? and(eq(products.slug, candidate), ne(products.id, currentProductId))
          : eq(products.slug, candidate),
      )
      .limit(1);

    if (duplicate.length === 0) {
      return candidate;
    }

    counter += 1;
    candidate = `${base}-${counter}`;
  }
}

export function soldOutTimestampForStock(stock: number, previousSoldOutAt: Date | null) {
  if (stock <= 0) {
    return previousSoldOutAt ?? new Date();
  }
  return null;
}

export function toMoneyLabel(value: string | number | null) {
  const amount = Number(value ?? 0);
  if (Number.isNaN(amount)) {
    return "PKR 0";
  }

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export async function pingDb() {
  await db.execute(sql`select 1`);
}
