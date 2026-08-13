import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getHandmadeProducts, getOrCreateSiteSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HandmadePage() {
  const [settings, handmadeProducts] = await Promise.all([getOrCreateSiteSettings(), getHandmadeProducts()]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fef2f2] via-[#fff1f2] to-[#fdf4ff]">
      <SiteHeader brandName={settings.brandName} />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 md:grid-cols-2 md:px-8">
        <Reveal>
          <article className="space-y-4">
            <p className="text-xs uppercase tracking-[0.24em] text-rose-700">Handmade Collection</p>
            <h2 className="text-4xl font-black text-zinc-900">Crafted by Hand, Styled with Soul</h2>
            <p className="text-zinc-700">
              Each design carries artisan workmanship with delicate embroidery and limited quantity pieces.
            </p>
            <Link href="/place-order" className="inline-flex rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-500">
              Place Handmade Order
            </Link>
          </article>
        </Reveal>

        <Reveal>
          <article className="overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/handmade-detail.jpg" alt="Handmade embroidery detail" className="h-full w-full object-cover" />
          </article>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 md:px-8">
        {handmadeProducts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-rose-300 bg-white p-8 text-sm text-zinc-600">
            No handmade products found yet. Add products with category/name/description containing “handmade”.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {handmadeProducts.map((product) => (
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
