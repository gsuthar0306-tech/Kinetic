import { useState } from "react";
import { ArrowRight, Heart, ShoppingBag, Tag } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { useFavorites } from "@/context/FavoritesContext";
import AddToBag from "@/components/subComponents/AddToBag";
import { formatRupees, type Product } from "@/services/products";

type FavoritesFilter = "all" | "on-sale";
type FavoritesSort = "saved" | "price-low" | "price-high";

const Favorites = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isLoading } = useFavorites();

  const [removingId, setRemovingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FavoritesFilter>("all");
  const [sortBy, setSortBy] = useState<FavoritesSort>("saved");

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleRemoveFavorite = async (product: Product) => {
    if (removingId !== null) return;

    setRemovingId(product.id);

    try {
      await toggleFavorite(product);
      toast.success("Removed from favorites", {
        description: "Product removed from your favorites.",
      });
    } catch {
      toast.error("Couldn't remove favorite", {
        description: "Please check your connection and try again.",
      });
    } finally {
      setRemovingId(null);
    }
  };

  const onSaleCount = favorites.filter(
    (product) => product.actualPrice > product.price,
  ).length;

  const visibleFavorites = favorites
    .filter(
      (product) =>
        filter === "all" || product.actualPrice > product.price,
    )
    .slice()
    .sort((first, second) => {
      if (sortBy === "price-low") return first.price - second.price;
      if (sortBy === "price-high") return second.price - first.price;
      return 0;
    });

  const savedValue = favorites.reduce(
    (total, product) => total + product.price,
    0,
  );

  if (isLoading) {
    return (
      <main className="min-h-[65vh] px-3 py-6 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-9 w-56 animate-pulse rounded bg-slate-200" />
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (favorites.length === 0) {
    return (
      <main className="min-h-[65vh] px-3 py-6 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">
            Personal collection <span className="text-slate-400">/</span> saved
            items
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Saved Items
          </h1>

          <div className="mt-8 flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Heart size={25} />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Your collection starts here
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Save products you like and they’ll be waiting here whenever
              you’re ready.
            </p>
            <button
              type="button"
              onClick={() => navigate("/store")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Explore the store <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[65vh] px-3 py-6 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">
                Personal collection <span className="text-slate-400">/</span>{" "}
                saved items
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  Saved Items
                </h1>
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                  {favorites.length} {favorites.length === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Keep the products you love close at hand.
              </p>
            </div>

            <label className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500 sm:self-auto">
              <span className="font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as FavoritesSort)
                }
                aria-label="Sort saved items"
                className="max-w-40 cursor-pointer bg-transparent font-semibold text-slate-800 outline-none"
              >
                <option value="saved">Saved order</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setFilter("all")}
              aria-pressed={filter === "all"}
              className={`rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                filter === "all"
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              All ({favorites.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("on-sale")}
              aria-pressed={filter === "on-sale"}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                filter === "on-sale"
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Tag size={13} />
              Price drops ({onSaleCount})
            </button>
          </div>
        </div>

        {visibleFavorites.length > 0 ? (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {visibleFavorites.map((product) => {
              const hasDiscount = product.actualPrice > product.price;

              return (
                <article
                  key={product.id}
                  className="group relative flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm transition-shadow hover:shadow-md sm:p-3"
                >
                  <button
                    type="button"
                    onClick={() => void handleRemoveFavorite(product)}
                    disabled={removingId !== null}
                    aria-label={`Remove ${product.title} from favorites`}
                    className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-slate-100 bg-white/95 text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Heart size={15} className="fill-current" />
                  </button>

                  {hasDiscount && (
                    <span className="absolute left-4 top-4 z-10 rounded-md bg-red-50 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-red-600">
                      Price drop
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleProductClick(product)}
                    aria-label={`View ${product.title}`}
                    className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-3 sm:p-4"
                  >
                    <img
                      src={product.thumbnail || ""}
                      alt={product.title || "Product"}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>

                  <div className="flex flex-1 flex-col pt-3">
                    <p className="truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {product.subCategory ||
                        product.category ||
                        "Kinetic product"}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleProductClick(product)}
                      className="mt-1 min-h-10 text-left text-xs font-semibold leading-5 text-slate-900 transition-colors hover:text-blue-700 sm:text-sm"
                    >
                      <span className="line-clamp-2">
                        {product.title || "Untitled Product"}
                      </span>
                    </button>

                    <div className="mt-2 flex min-h-8 flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-sm font-bold text-slate-900">
                        {formatRupees(product.price || 0)}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatRupees(product.actualPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-2">
                      <AddToBag product={product} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center">
            <Tag className="mx-auto text-slate-400" size={22} />
            <h2 className="mt-3 text-sm font-semibold text-slate-900">
              No price drops in your saved items
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Switch back to all items to see your full collection.
            </p>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="mt-4 text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              Show all saved items
            </button>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Heart size={18} />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                {favorites.length} {favorites.length === 1 ? "item" : "items"}{" "}
                in your collection
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">
                Current saved value: {formatRupees(savedValue)}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/store")}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Keep browsing <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => navigate("/profile/cart")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
            >
              <ShoppingBag size={14} /> View bag
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Favorites;
