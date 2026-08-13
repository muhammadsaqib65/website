import { toMoneyLabel } from "@/lib/store";

type ProductCardProps = {
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    compareAtPrice: string | null;
    category: string;
    imageUrl: string;
    stock: number;
    soldOutDetails: string | null;
    soldOutAt: Date | null;
  };
};

function soldOutDate(date: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat("en-PK", { dateStyle: "medium" }).format(date);
}

export function ProductCard({ product }: ProductCardProps) {
  const isSoldOut = product.stock <= 0;

  return (
    <article className="group overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[4/5] bg-amber-50">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-zinc-500">No image available</div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold">{product.name}</h4>
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-900">{product.category}</span>
        </div>
        <p className="line-clamp-2 text-sm text-zinc-600">{product.description}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm font-bold">{toMoneyLabel(product.price)}</p>
          {product.compareAtPrice ? (
            <p className="text-xs text-zinc-500 line-through">{toMoneyLabel(product.compareAtPrice)}</p>
          ) : null}
        </div>

        {isSoldOut ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">
            <p className="font-semibold">Sold Out</p>
            <p>{product.soldOutDetails || "This item is currently out of stock."}</p>
            {product.soldOutAt ? <p>Since: {soldOutDate(product.soldOutAt)}</p> : null}
          </div>
        ) : (
          <p className="text-xs text-emerald-700">In stock: {product.stock}</p>
        )}
      </div>
    </article>
  );
}
