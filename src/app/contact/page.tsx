import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getOrCreateSiteSettings } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getOrCreateSiteSettings();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#faf5ff] via-[#fdf2f8] to-[#fff7ed]">
      <SiteHeader brandName={settings.brandName} />

      <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-10 md:grid-cols-2 md:px-8">
        <Reveal>
          <article className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-fuchsia-100">
            <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-700">Contact Details</p>
            <h2 className="mt-2 text-3xl font-black text-zinc-900">We’re here to help</h2>
            <ul className="mt-5 space-y-3 text-sm text-zinc-700">
              <li><span className="font-semibold">Email:</span> {settings.contactEmail}</li>
              <li><span className="font-semibold">Phone:</span> {settings.contactPhone}</li>
              <li><span className="font-semibold">Address:</span> {settings.contactAddress}</li>
              <li>
                <span className="font-semibold">Instagram:</span>{" "}
                <a href={settings.instagramUrl} className="text-fuchsia-700 underline">{settings.instagramUrl}</a>
              </li>
              <li>
                <span className="font-semibold">WhatsApp:</span>{" "}
                <a href={`https://wa.me/${settings.whatsappNumber}`} className="text-fuchsia-700 underline">
                  {settings.whatsappNumber}
                </a>
              </li>
            </ul>
          </article>
        </Reveal>

        <Reveal>
          <article className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-fuchsia-100">
            <p className="text-xs uppercase tracking-[0.22em] text-fuchsia-700">Message Us</p>
            <h2 className="mt-2 text-3xl font-black text-zinc-900">Quick Contact Form</h2>
            <ContactForm />
          </article>
        </Reveal>
      </section>

      <SiteFooter brandName={settings.brandName} paymentMethods={settings.paymentMethods} />
    </main>
  );
}
