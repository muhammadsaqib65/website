import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SeasonRotator } from "@/components/season-rotator";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOrCreateSiteSettings, getPublicProducts, pingDb } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await pingDb();

  const [settings, products] = await Promise.all([getOrCreateSiteSettings(), getPublicProducts()]);
  const featured = products.slice(0, 6);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fff7ed] via-[#fef3c7] to-[#f8fafc] text-zinc-900">
      <SiteHeader brandName={settings.brandName} />

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-12 md:grid-cols-2 md:px-8 md:py-16">
        <Reveal>
          <article className="space-y-4">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-700">New Season Launch</p>
            <h2 className="text-4xl font-black leading-tight md:text-6xl">Wear the Story. Own the Moment.</h2>
            <p className="max-w-xl text-zinc-700">{settings.tagline}</p>
            <SeasonRotator />
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/summer-collection" className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700">
                Explore Summer
              </Link>
              <Link href="/place-order" className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-amber-400">
                Place an Order
              </Link>
            </div>
          </article>
        </Reveal>

        <Reveal>
          <article className="overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/brand-hero.jpg" alt="Riwaayat Studio fashion" className="h-full w-full object-cover" />
          </article>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-10 md:px-8">
        <Reveal className="rounded-2xl bg-zinc-900 p-6 text-zinc-100 shadow-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">Quick Access</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Link href="/summer-collection" className="rounded-xl bg-zinc-800 p-4 transition hover:-translate-y-1 hover:bg-zinc-700">
              <h3 className="font-semibold">Summer Collection</h3>
              <p className="text-sm text-zinc-300">Fresh tones, breathable fabrics, seasonal essentials.</p>
            </Link>
            <Link href="/handmade" className="rounded-xl bg-zinc-800 p-4 transition hover:-translate-y-1 hover:bg-zinc-700">
              <h3 className="font-semibold">Handmade Collection</h3>
              <p className="text-sm text-zinc-300">Artisan details, hand-finished pieces, limited stock.</p>
            </Link>
            <Link href="/contact" className="rounded-xl bg-zinc-800 p-4 transition hover:-translate-y-1 hover:bg-zinc-700">
              <h3 className="font-semibold">Contact & Support</h3>
              <p className="text-sm text-zinc-300">Fast support for sizing, shipping, and custom orders.</p>
            </Link>
          </div>
        </Reveal>
      </section>

      <section id="collection" className="mx-auto w-full max-w-7xl px-4 pb-10 md:px-8">
        <div className="mb-4 flex items-end justify-between">
          <h3 className="text-2xl font-bold">Featured Collection</h3>
          <p className="text-sm text-zinc-600">{products.length} products available</p>
        </div>

        {featured.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-400 bg-white p-8 text-zinc-600">
            No products yet. Add items from the admin panel.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <Reveal key={product.id}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <section id="contact" className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-12 md:grid-cols-2 md:px-8">
        <Reveal>
          <article>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Contact Details</p>
            <h3 className="mt-2 text-2xl font-bold">Let’s style your next look</h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-700">
              <li>Email: {settings.contactEmail}</li>
              <li>Phone: {settings.contactPhone}</li>
              <li>Address: {settings.contactAddress}</li>
              <li>
                Instagram: <a href={settings.instagramUrl} className="text-amber-700 underline">{settings.instagramUrl}</a>
              </li>
              <li>
                WhatsApp: <a href={`https://wa.me/${settings.whatsappNumber}`} className="text-amber-700 underline">{settings.whatsappNumber}</a>
              </li>
            </ul>
          </article>
        </Reveal>

        <Reveal>
          <article>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Quick Message</p>
            <h3 className="mt-2 text-2xl font-bold">Contact Form</h3>
            <ContactForm />
          </article>
        </Reveal>
      </section>

      <SiteFooter brandName={settings.brandName} paymentMethods={settings.paymentMethods} />
    </main>
  );
}
