"use server";

import { db } from "@/db";
import { products, siteSettings } from "@/db/schema";
import {
  cleanupExpiredAdminSessions,
  clearAdminSession,
  createAdminSession,
  getAdminCredentials,
  isAdminAuthenticated,
} from "@/lib/admin-auth";
import {
  createUniqueSlug,
  soldOutTimestampForStock,
} from "@/lib/store";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getText(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function getNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(getText(formData, key, String(fallback)));
  return Number.isFinite(value) ? value : fallback;
}

export async function loginAction(formData: FormData) {
  await cleanupExpiredAdminSessions();

  const username = getText(formData, "username");
  const password = getText(formData, "password");
  const creds = getAdminCredentials();

  if (username !== creds.username || password !== creds.password) {
    redirect("/admin/login?error=1");
  }

  await createAdminSession();
  redirect("/admin");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

async function assertAdmin() {
  const ok = await isAdminAuthenticated();
  if (!ok) {
    redirect("/admin/login");
  }
}

export async function createProductAction(formData: FormData) {
  await assertAdmin();

  const name = getText(formData, "name");
  if (!name) {
    redirect("/admin?error=missing-name");
  }

  const price = getNumber(formData, "price");
  const compareAtPrice = getNumber(formData, "compareAtPrice", 0);
  const stock = Math.max(0, Math.floor(getNumber(formData, "stock", 0)));
  const isActive = getText(formData, "isActive") === "on";
  const soldOutDetails = getText(formData, "soldOutDetails");
  const slug = await createUniqueSlug(name);

  await db.insert(products).values({
    name,
    slug,
    description: getText(formData, "description"),
    price: price.toFixed(2),
    compareAtPrice: compareAtPrice > 0 ? compareAtPrice.toFixed(2) : null,
    category: getText(formData, "category", "General"),
    imageUrl: getText(formData, "imageUrl"),
    stock,
    isActive,
    soldOutDetails: stock <= 0 ? soldOutDetails || "This article is currently sold out." : null,
    soldOutAt: soldOutTimestampForStock(stock, null),
    updatedAt: new Date(),
  });

  revalidatePath("/");
  revalidatePath("/summer-collection");
  revalidatePath("/handmade");
  revalidatePath("/place-order");
  revalidatePath("/admin");
  redirect("/admin?success=product-created");
}

export async function updateProductAction(formData: FormData) {
  await assertAdmin();

  const id = Number(getText(formData, "id", "0"));
  if (!Number.isFinite(id) || id <= 0) {
    redirect("/admin?error=invalid-id");
  }

  const existing = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (existing.length === 0) {
    redirect("/admin?error=not-found");
  }

  const name = getText(formData, "name");
  if (!name) {
    redirect("/admin?error=missing-name");
  }

  const stock = Math.max(0, Math.floor(getNumber(formData, "stock", 0)));
  const price = getNumber(formData, "price", Number(existing[0].price));
  const compareAtPrice = getNumber(formData, "compareAtPrice", Number(existing[0].compareAtPrice ?? 0));
  const slug = await createUniqueSlug(name, id);
  const soldOutDetailsInput = getText(formData, "soldOutDetails");

  await db
    .update(products)
    .set({
      name,
      slug,
      description: getText(formData, "description"),
      category: getText(formData, "category", "General"),
      imageUrl: getText(formData, "imageUrl"),
      price: price.toFixed(2),
      compareAtPrice: compareAtPrice > 0 ? compareAtPrice.toFixed(2) : null,
      stock,
      isActive: getText(formData, "isActive") === "on",
      soldOutDetails:
        stock <= 0
          ? soldOutDetailsInput || existing[0].soldOutDetails || "This article is currently sold out."
          : null,
      soldOutAt: soldOutTimestampForStock(stock, existing[0].soldOutAt),
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/summer-collection");
  revalidatePath("/handmade");
  revalidatePath("/place-order");
  revalidatePath("/admin");
  redirect("/admin?success=product-updated");
}

export async function deleteProductAction(formData: FormData) {
  await assertAdmin();

  const id = Number(getText(formData, "id", "0"));
  if (!Number.isFinite(id) || id <= 0) {
    redirect("/admin?error=invalid-id");
  }

  await db.delete(products).where(eq(products.id, id));

  revalidatePath("/");
  revalidatePath("/summer-collection");
  revalidatePath("/handmade");
  revalidatePath("/place-order");
  revalidatePath("/admin");
  redirect("/admin?success=product-deleted");
}

export async function updateSettingsAction(formData: FormData) {
  await assertAdmin();

  const settingsId = Number(getText(formData, "id", "1"));
  const paymentMethodsRaw = getText(formData, "paymentMethods");
  const methods = paymentMethodsRaw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  await db
    .update(siteSettings)
    .set({
      brandName: getText(formData, "brandName", "Riwaayat Studio"),
      tagline: getText(formData, "tagline"),
      about: getText(formData, "about"),
      contactEmail: getText(formData, "contactEmail"),
      contactPhone: getText(formData, "contactPhone"),
      contactAddress: getText(formData, "contactAddress"),
      instagramUrl: getText(formData, "instagramUrl"),
      whatsappNumber: getText(formData, "whatsappNumber"),
      paymentMethods: methods.length ? methods : ["Cash on Delivery"],
      updatedAt: new Date(),
    })
    .where(eq(siteSettings.id, settingsId));

  revalidatePath("/");
  revalidatePath("/summer-collection");
  revalidatePath("/handmade");
  revalidatePath("/contact");
  revalidatePath("/place-order");
  revalidatePath("/admin");
  redirect("/admin?success=settings-updated");
}
