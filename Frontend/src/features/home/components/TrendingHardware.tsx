import { Star } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { useQuery } from "@tanstack/react-query";

import AddtoHeart from "@/components/subComponents/AddtoHeart";
import AddToBag from "@/components/subComponents/AddToBag";
import {
  formatRupees,
  getElectronicProducts,
  productKeys,
  type Product,
} from "@/services/products";

const TrendingHardware = () => {
  const navigate = useNavigate();

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: productKeys.list(1, 24),
    queryFn: () => getElectronicProducts(1, 24),
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.items.slice(0, 4) ?? [];

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section className="bg-white px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
              NEW ARRIVALS
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">
              Trending Hardware
            </h2>
          </div>

          <Link
            to="/store"
            className="shrink-0 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-800"
          >
            View All &rarr;
          </Link>
        </div>

        {isError && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5 text-center"
          >
            <p className="text-sm text-red-700">
              Could not load trending products.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!isError && (
          <div
            aria-busy={isPending}
            className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
          >
            {isPending
              ? Array.from({ length: 4 }, (_, index) => (
                  <article
                    key={index}
                    className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm sm:p-3"
                  >
                    <div className="aspect-square animate-pulse rounded-md bg-slate-100" />

                    <div className="px-1 pb-1 pt-3">
                      <div className="h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                      <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />
                      <div className="mt-4 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                      <div className="mt-4 h-9 animate-pulse rounded bg-slate-100" />
                    </div>
                  </article>
                ))
              : products.map((product) => (
                  <article
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-shadow hover:shadow-md sm:p-3"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-md bg-white">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        loading="lazy"
                        className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                      />

                      <AddtoHeart product={product} variant="detail" />
                    </div>

                    <div className="px-1 pb-1 pt-3">
                      <p className="truncate text-[9px] font-semibold tracking-[0.14em] text-slate-400">
                        {product.category} · {product.subCategory}
                      </p>

                      <h3
                        title={product.title}
                        className="mt-1 truncate text-sm font-semibold text-slate-900"
                      >
                        {product.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-bold text-slate-950">
                            {formatRupees(product.price)}
                          </span>

                          {product.actualPrice > product.price && (
                            <span className="text-xs text-slate-400 line-through">
                              {formatRupees(product.actualPrice)}
                            </span>
                          )}
                        </div>

                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Star className="size-3 fill-amber-400 text-amber-400" />
                          {Number(product.rating || 0).toFixed(1)}
                        </span>
                      </div>

                      <div onClick={(event) => event.stopPropagation()}>
                        <AddToBag product={product} variant="card" />
                      </div>
                    </div>
                  </article>
                ))}

            {!isPending && !isError && products.length === 0 && (
              <p className="col-span-full py-10 text-center text-sm text-slate-500">
                No products are available right now.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingHardware;
