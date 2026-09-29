import { Heart, Star, Trash2 } from "lucide-react";

import { useFavorites } from "@/context/FavoritesContext";
import AddToBag from "@/components/subComponents/AddToBag";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <main className="min-h-[65vh] px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Favorites
            </h1>
          </div>

          <div className="mt-10 flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Heart className="h-9 w-9 text-gray-400" />
            </div>

            <h2 className="mt-6 text-xl font-semibold text-gray-900">
              No favorites yet
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
              Save products you love by clicking the heart icon. They will
              appear here so you can easily find them later.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[65vh] bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-7 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                Favorites
              </h1>
            </div>

            <p className="mt-3 text-sm text-gray-500">
              Your favorite products, all in one place.
            </p>
          </div>

          {favorites.length > 0 && (
            <p className="text-sm font-medium text-gray-500">
              {favorites.length}{" "}
              {favorites.length === 1 ? "product" : "products"}
            </p>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((product) => (
            <article
              key={product.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <button
                type="button"
                onClick={() => toggleFavorite(product)}
                aria-label={`Remove ${product.title} from favorites`}
                className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/95 shadow-sm backdrop-blur transition-all duration-200 hover:scale-105 hover:border-red-200 hover:bg-red-50"
              >
                <Heart className="h-[18px] w-[18px] fill-red-500 text-red-500" />
              </button>

              <div className="flex h-56 items-center justify-center overflow-hidden rounded-xl bg-gray-50 p-6">
                <img
                  src={product.thumbnail || ""}
                  alt={product.title || "Product"}
                  className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col pt-5">
                <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  {product.category || "Uncategorized"}
                </span>

                <h2 className="mt-3 line-clamp-2 min-h-[48px] text-base font-semibold leading-6 text-gray-900">
                  {product.title || "Untitled Product"}
                </h2>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(product.price || 0)}
                  </span>

                  <span className="text-xs text-gray-400">
                    <Star className="fill-amber-400" />{" "}
                    {(product.rating ?? 0).toFixed(1)}
                  </span>
                </div>

                <div className="mt-5">
                  <AddToBag product={product} />
                </div>

                <button
                  type="button"
                  onClick={() => toggleFavorite(product)}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-gray-400 transition-colors hover:text-red-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove from favorites
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Favorites;
