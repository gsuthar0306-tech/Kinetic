import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

import { useQuery } from "@tanstack/react-query";

import {
  getElectronicProducts,
  productKeys,
  type Product,
} from "@/services/products";

interface Collection {
  title: string;
  description: string;
  subCategory: string;
  layout: string;
}

const collections: Collection[] = [
  {
    title: "Performance Computing",
    description: "Workstations built for the most demanding tasks.",
    subCategory: "Laptops",
    layout: "lg:col-span-2",
  },
  {
    title: "High-Fidelity Audio",
    description: "Immersive soundscapes.",
    subCategory: "Speakers & Soundbars",
    layout: "",
  },
  {
    title: "Tablets & Displays",
    description: "Portable screens for everyday work.",
    subCategory: "Tablets",
    layout: "",
  },
  {
    title: "Smartphones",
    description: "Connected technology that moves with you.",
    subCategory: "Smartphones",
    layout: "lg:col-span-2",
  },
];

const Collections = () => {
  const navigate = useNavigate();

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: productKeys.list(1, 24),
    queryFn: () => getElectronicProducts(1, 24),
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.items ?? [];

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCollectionClick = (subCategory: string) => {
    navigate(`/store?category=${encodeURIComponent(subCategory)}`);
  };

  return (
    <section className="bg-slate-50 px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
          COLLECTIONS
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-3xl">
          Curated Categories
        </h2>

        {isError && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 p-5 text-center"
          >
            <p className="text-sm text-red-700">
              Could not load products for the collections.
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
            className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:grid-rows-[16.75rem_11.25rem]"
          >
            {collections.map((collection, index) => {
              const product =
                products.find(
                  (item) =>
                    item.subCategory.trim().toLowerCase() ===
                    collection.subCategory.trim().toLowerCase(),
                ) ?? products[index];

              return (
                <article
                  key={collection.title}
                  className={`group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-200 sm:aspect-[16/10] lg:aspect-auto ${collection.layout}`}
                >
                  {isPending ? (
                    <div className="absolute inset-0 animate-pulse bg-slate-200" />
                  ) : product?.thumbnail ? (
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full bg-white object-contain p-3 transition duration-500 group-hover:scale-105 sm:p-5"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-200" />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-white">
                        {collection.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-200">
                        {collection.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={`Explore ${collection.title}`}
                      onClick={() => {
                        if (product) {
                          handleProductClick(product);
                        } else if (!isPending) {
                          handleCollectionClick(collection.subCategory);
                        }
                      }}
                      disabled={isPending}
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-white/25 text-white backdrop-blur transition-colors hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Collections;
