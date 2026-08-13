import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOrCreateSiteSettings, getSummerProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function SummerCollectionPage() {
  const [settings, summerProducts] = await Promise.all([getOrCreateSiteSettings(), getSummerProducts()]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff7ed] via-[#fffbeb] to-[#ecfeff]">
      <SiteHeader brandName={settings.brandName} />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 md:grid-cols-2 md:px-8">
        <Reveal>
          <article className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-orange-700">Summer Collection</p>
            <h2 className="text-4xl font-black text-zinc-900">Breezy Looks, Bright Days</h2>
            <p className="text-zinc-700">
              Discover lightweight textures, fresh palettes, and hand-finished pieces designed for warm-weather elegance.
            </p>
            <Link href="/place-order" className="inline-flex rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-orange-500">
              Order from Summer Collection
            </Link>
          </article>
        </Reveal>

        <Reveal>
          <article className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/summer-collection.jpg" alt="Summer collection lookbook" className="h-full w-full object-cover" />
          </article>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-8">
        {summerProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-orange-300 bg-white p-8 text-sm text-zinc-600">
            No summer products found yet. Add products with category or name containing “summer” from admin.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {summerProducts.map((product) => (
              <Reveal key={product.id}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <SiteFooter brandName={settings.brandName} paymentMethods={settings.paymentMethods} />
    </main>
  );
}
