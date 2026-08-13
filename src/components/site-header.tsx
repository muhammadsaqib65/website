import Link from "next/link";

type SiteHeaderProps = {
  brandName: string;
};

export function SiteHeader({ brandName }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-700">Riwaayat Studio</p>
          <h1 className="text-lg font-bold text-zinc-900">{brandName}</h1>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-700 md:gap-4">
          <Link href="/" className="rounded-full px-3 py-1 hover:bg-amber-50 hover:text-amber-800">Home</Link>
          <Link href="/summer-collection" className="rounded-full px-3 py-1 hover:bg-amber-50 hover:text-amber-800">Summer Collection</Link>
          <Link href="/handmade" className="rounded-full px-3 py-1 hover:bg-amber-50 hover:text-amber-800">Handmade</Link>
          <Link href="/place-order" className="rounded-full px-3 py-1 hover:bg-amber-50 hover:text-amber-800">Place Order</Link>
          <Link href="/contact" className="rounded-full px-3 py-1 hover:bg-amber-50 hover:text-amber-800">Contact</Link>
          <Link href="/admin/login" className="rounded-full border border-zinc-300 px-3 py-1 hover:bg-zinc-100">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
