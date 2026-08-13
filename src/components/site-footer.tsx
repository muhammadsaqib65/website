type SiteFooterProps = {
  brandName: string;
  paymentMethods: string[];
};

export function SiteFooter({ brandName, paymentMethods }: SiteFooterProps) {
  return (
    <footer className="mt-16 border-t border-amber-200 bg-white/80">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:px-8">
        <h4 className="text-lg font-bold text-zinc-900">{brandName}</h4>
        <p className="mt-1 text-sm text-zinc-600">Handcrafted fashion with trusted delivery and clear stock updates.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {paymentMethods.map((method) => (
            <span key={method} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
              {method}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
