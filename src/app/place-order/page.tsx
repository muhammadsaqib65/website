import { placeOrderAction } from "@/app/place-order/actions";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOrCreateSiteSettings, getPublicProducts, toMoneyLabel } from "@/lib/store";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PlaceOrderPage({ searchParams }: PageProps) {
  const [settings, products, params] = await Promise.all([
    getOrCreateSiteSettings(),
    getPublicProducts(),
    searchParams,
  ]);

  const available = products.filter((p) => p.stock > 0);
  const success = params?.success === "1";
  const error = typeof params?.error === "string" ? params.error.replaceAll("-", " ") : "";

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ecfeff] via-[#f0f9ff] to-[#fff7ed]">
      <SiteHeader brandName={settings.brandName} />

      <section className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
        <Reveal>
          <article className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-cyan-100">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">Place Order</p>
            <h2 className="mt-2 text-3xl font-black text-zinc-900">Secure Checkout Request</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Submit your order details and our team will confirm quickly by phone or WhatsApp.
            </p>

            {success ? (
              <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                Your order has been placed successfully.
              </p>
            ) : null}

            {error ? (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Could not place order: {error}
              </p>
            ) : null}

            <form action={placeOrderAction} className="mt-6 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Full Name
                  <input name="customerName" required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
                <label className="text-sm">
                  Email
                  <input name="customerEmail" type="email" required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Phone
                  <input name="customerPhone" required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
                <label className="text-sm">
                  Quantity
                  <input name="quantity" type="number" min={1} step={1} defaultValue={1} required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
              </div>

              <label className="block text-sm">
                Product
                <select name="productId" required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2">
                  <option value="">Select a product</option>
                  {available.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} — {toMoneyLabel(product.price)} (Stock: {product.stock})
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                Address
                <textarea name="address" required rows={3} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
              </label>

              <label className="block text-sm">
                Payment Method
                <select name="paymentMethod" required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2">
                  {settings.paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block text-sm">
                Notes (optional)
                <textarea name="notes" rows={3} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
              </label>

              <button type="submit" className="rounded-lg bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500">
                Submit Order
              </button>
            </form>
          </article>
        </Reveal>
      </section>

      <SiteFooter brandName={settings.brandName} paymentMethods={settings.paymentMethods} />
    </main>
  );
}
