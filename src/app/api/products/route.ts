import { db } from "@/db";
import { products } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      price: products.price,
      compareAtPrice: products.compareAtPrice,
      category: products.category,
      imageUrl: products.imageUrl,
      stock: products.stock,
      soldOutDetails: products.soldOutDetails,
      soldOutAt: products.soldOutAt,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(and(eq(products.isActive, true)))
    .orderBy(desc(products.createdAt));

  return Response.json({ ok: true, products: rows });
}
