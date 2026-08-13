"use server";

import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { soldOutTimestampForStock } from "@/lib/store";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function placeOrderAction(formData: FormData) {
  const customerName = getText(formData, "customerName");
  const customerEmail = getText(formData, "customerEmail");
  const customerPhone = getText(formData, "customerPhone");
  const address = getText(formData, "address");
  const paymentMethod = getText(formData, "paymentMethod");
  const notes = getText(formData, "notes");
  const productId = Number(getText(formData, "productId"));
  const quantity = Math.max(1, Math.floor(Number(getText(formData, "quantity")) || 1));

  if (!customerName || !customerEmail || !customerPhone || !address || !paymentMethod || !Number.isFinite(productId)) {
    redirect("/place-order?error=invalid-input");
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail);
  if (!emailOk) {
    redirect("/place-order?error=invalid-email");
  }

  await db.transaction(async (tx) => {
    const found = await tx.select().from(products).where(eq(products.id, productId)).limit(1);
    if (found.length === 0) {
      redirect("/place-order?error=product-not-found");
    }

    const product = found[0];

    if (!product.isActive) {
      redirect("/place-order?error=product-inactive");
    }

    if (product.stock < quantity) {
      redirect("/place-order?error=insufficient-stock");
    }

    const unit = Number(product.price);
    const total = unit * quantity;
    const nextStock = product.stock - quantity;

    await tx.insert(orders).values({
      customerName,
      customerEmail,
      customerPhone,
      address,
      productId,
      productName: product.name,
      quantity,
      unitPrice: unit.toFixed(2),
      totalPrice: total.toFixed(2),
      paymentMethod,
      status: "placed",
      notes: notes || null,
    });

    await tx
      .update(products)
      .set({
        stock: nextStock,
        soldOutAt: soldOutTimestampForStock(nextStock, product.soldOutAt),
        soldOutDetails:
          nextStock <= 0
            ? product.soldOutDetails || "Sold out after recent orders. New stock coming soon."
            : null,
        updatedAt: new Date(),
      })
      .where(eq(products.id, product.id));
  });

  revalidatePath("/");
  revalidatePath("/summer-collection");
  revalidatePath("/handmade");
  revalidatePath("/place-order");
  revalidatePath("/admin");
  redirect("/place-order?success=1");
}
