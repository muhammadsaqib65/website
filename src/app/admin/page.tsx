import {
  createProductAction,
  deleteProductAction,
  logoutAction,
  updateProductAction,
  updateSettingsAction,
} from "@/app/admin/actions";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  getAdminProducts,
  getOrCreateSiteSettings,
  getRecentContactSubmissions,
  getRecentOrders,
  toMoneyLabel,
} from "@/lib/store";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function prettyDate(value: Date | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

export default async function AdminDashboard({ searchParams }: AdminPageProps) {
  const isAuthed = await isAdminAuthenticated();
  if (!isAuthed) {
    redirect("/admin/login");
  }

  const [settings, products, contacts, recentOrders, params] = await Promise.all([
    getOrCreateSiteSettings(),
    getAdminProducts(),
    getRecentContactSubmissions(),
    getRecentOrders(),
    searchParams,
  ]);

  const message = (params?.success as string | undefined) ?? "";

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-900 md:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-3 rounded-2xl bg-zinc-900 p-6 text-zinc-50">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Secure Admin Panel</p>
            <h1 className="mt-2 text-3xl font-bold">Riwaayat Studio Control Center</h1>
            <p className="mt-2 text-sm text-zinc-300">
              Manage catalog, sold-out records, contact details, and payment methods.
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700"
            >
              Logout
            </button>
          </form>
        </header>

        {message ? (
          <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            Success: {message.replaceAll("-", " ")}
          </p>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-xl font-semibold">Store Settings</h2>
            <p className="mt-1 text-sm text-zinc-600">Visible on storefront contact/payment sections.</p>
            <form action={updateSettingsAction} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={settings.id} />
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Brand Name
                  <input name="brandName" defaultValue={settings.brandName} required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
                <label className="text-sm">
                  Tagline
                  <input name="tagline" defaultValue={settings.tagline} required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
              </div>

              <label className="block text-sm">
                About
                <textarea name="about" defaultValue={settings.about} rows={3} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Contact Email
                  <input name="contactEmail" type="email" defaultValue={settings.contactEmail} required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
                <label className="text-sm">
                  Contact Phone
                  <input name="contactPhone" defaultValue={settings.contactPhone} required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
              </div>

              <label className="block text-sm">
                Address
                <input name="contactAddress" defaultValue={settings.contactAddress} required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Instagram URL
                  <input name="instagramUrl" defaultValue={settings.instagramUrl} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
                <label className="text-sm">
                  WhatsApp Number
                  <input name="whatsappNumber" defaultValue={settings.whatsappNumber} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
              </div>

              <label className="block text-sm">
                Payment Methods (one per line)
                <textarea
                  name="paymentMethods"
                  rows={4}
                  defaultValue={settings.paymentMethods.join("\n")}
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
              </label>

              <button className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700" type="submit">
                Save Settings
              </button>
            </form>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-xl font-semibold">Add New Product</h2>
            <p className="mt-1 text-sm text-zinc-600">Create launch products with stock and sold-out details.</p>
            <form action={createProductAction} className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  Name
                  <input name="name" required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
                <label className="text-sm">
                  Category
                  <input name="category" defaultValue="Unstitched" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
              </div>
              <label className="block text-sm">
                Description
                <textarea name="description" rows={3} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
              </label>
              <label className="block text-sm">
                Image URL
                <input name="imageUrl" placeholder="https://..." className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="text-sm">
                  Price (PKR)
                  <input name="price" type="number" min="0" step="1" required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
                <label className="text-sm">
                  Compare Price
                  <input name="compareAtPrice" type="number" min="0" step="1" className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
                <label className="text-sm">
                  Stock
                  <input name="stock" type="number" min="0" step="1" required className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                </label>
              </div>
              <label className="block text-sm">
                Sold-Out Details (used when stock is 0)
                <textarea name="soldOutDetails" rows={2} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" name="isActive" defaultChecked />
                Show on storefront
              </label>
              <button className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-amber-400" type="submit">
                Create Product
              </button>
            </form>
          </article>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-xl font-semibold">Existing Products</h2>
          <p className="mt-1 text-sm text-zinc-600">Update inventory, sold-out notes, visibility, and pricing.</p>
          <div className="mt-4 space-y-4">
            {products.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-500">
                No products yet.
              </p>
            ) : (
              products.map((product) => (
                <article key={product.id} className="rounded-xl border border-zinc-200 p-4">
                  <form action={updateProductAction} className="space-y-3">
                    <input type="hidden" name="id" value={product.id} />
                    <div className="grid gap-3 md:grid-cols-4">
                      <label className="text-sm md:col-span-2">
                        Name
                        <input name="name" defaultValue={product.name} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                      </label>
                      <label className="text-sm">
                        Category
                        <input name="category" defaultValue={product.category} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                      </label>
                      <label className="text-sm">
                        Stock
                        <input name="stock" type="number" min="0" step="1" defaultValue={product.stock} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                      </label>
                    </div>

                    <label className="block text-sm">
                      Description
                      <textarea name="description" defaultValue={product.description} rows={2} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                    </label>

                    <div className="grid gap-3 md:grid-cols-3">
                      <label className="text-sm">
                        Price
                        <input
                          name="price"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={Number(product.price)}
                          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                        />
                      </label>
                      <label className="text-sm">
                        Compare Price
                        <input
                          name="compareAtPrice"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={Number(product.compareAtPrice ?? 0)}
                          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                        />
                      </label>
                      <label className="text-sm">
                        Image URL
                        <input name="imageUrl" defaultValue={product.imageUrl} className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2" />
                      </label>
                    </div>

                    <label className="block text-sm">
                      Sold-Out Details
                      <textarea
                        name="soldOutDetails"
                        defaultValue={product.soldOutDetails ?? ""}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                      />
                    </label>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="space-y-1 text-xs text-zinc-600">
                        <p>Slug: {product.slug}</p>
                        <p>Price preview: {toMoneyLabel(product.price)}</p>
                        <p>Sold Out Since: {prettyDate(product.soldOutAt)}</p>
                      </div>

                      <label className="inline-flex items-center gap-2 text-sm">
                        <input type="checkbox" name="isActive" defaultChecked={product.isActive} />
                        Active on storefront
                      </label>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button type="submit" className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700">
                        Save Changes
                      </button>
                    </div>
                  </form>

                  <form action={deleteProductAction} className="mt-2">
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                    >
                      Delete Product
                    </button>
                  </form>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <p className="mt-1 text-sm text-zinc-600">Latest placed orders from the Place Order page.</p>

          <div className="mt-4 space-y-3">
            {recentOrders.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-500">
                No orders received yet.
              </p>
            ) : (
              recentOrders.map((order) => (
                <article key={order.id} className="rounded-lg border border-zinc-200 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                    <p>
                      Order #{order.id} • {prettyDate(order.createdAt)}
                    </p>
                    <p>Status: {order.status}</p>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">
                    {order.customerName} ordered {order.quantity} × {order.productName}
                  </p>
                  <p className="text-xs text-zinc-600">
                    {order.customerEmail} • {order.customerPhone}
                  </p>
                  <p className="text-xs text-zinc-600">Payment: {order.paymentMethod}</p>
                  <p className="mt-1 text-sm text-zinc-700">Address: {order.address}</p>
                  {order.notes ? <p className="mt-1 text-sm text-zinc-700">Notes: {order.notes}</p> : null}
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <h2 className="text-xl font-semibold">Recent Contact Messages</h2>
          <p className="mt-1 text-sm text-zinc-600">Latest inquiries submitted by customers.</p>

          <div className="mt-4 space-y-3">
            {contacts.length === 0 ? (
              <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-6 text-sm text-zinc-500">
                No contact messages received yet.
              </p>
            ) : (
              contacts.map((contact) => (
                <article key={contact.id} className="rounded-lg border border-zinc-200 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
                    <p>
                      #{contact.id} • {prettyDate(contact.createdAt)}
                    </p>
                    <p>{contact.email}</p>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-zinc-900">{contact.name}</p>
                  {contact.phone ? <p className="text-xs text-zinc-600">Phone: {contact.phone}</p> : null}
                  <p className="mt-2 whitespace-pre-wrap text-sm text-zinc-700">{contact.message}</p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
