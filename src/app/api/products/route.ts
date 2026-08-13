import { and, desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

async function loadDb() {
  const [{ db }, { products }] = await Promise.all([
    import("@/db"),
    import("@/db/schema"),
  ]);

  return { db, products };
}

export async function GET() {
  const { db, products } = await loadDb();

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
