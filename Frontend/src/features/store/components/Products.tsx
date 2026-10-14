import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Star } from "lucide-react";
import { useNavigate } from "react-router";

import {
  formatRupees,
  getElectronicProducts,
  productKeys,
  type Product,
} from "@/services/products";

import type { StoreFilters } from "./FilterSidebar";
import type { SortOption } from "./UnderNav";

import AddToBag from "@/components/subComponents/AddToBag";
import AddtoHeart from "@/components/subComponents/AddtoHeart";

interface ProductsProps {
  filters: StoreFilters;
  sortBy: SortOption;
  onResultCountChange: (count: number) => void;
}

const gridClasses =
  "grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:gap-4 sm:p-6 lg:grid-cols-4 lg:gap-5";

const Products = ({ filters, sortBy, onResultCountChange }: ProductsProps) => {
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const navigate = useNavigate();

  const selectedCategories = filters.categories ?? [];
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: productKeys.list(page, pageSize, selectedCategories),
    queryFn: () =>
      getElectronicProducts(
        page,
        pageSize,
        selectedCategories.length > 0 ? selectedCategories : undefined,
      ),
    staleTime: 5 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });

  const products = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  useEffect(() => {
    if (data) {
      onResultCountChange(data.totalCount);
    }
  }, [data, onResultCountChange]);

  useEffect(() => {
    setPage(1);
  }, [filters, sortBy]);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`, {
      state: { from: "store" },
    });
  };

  const filteredProducts = useMemo(() => {
    let result = products;

    if (filters.categories) {
      result = result.filter((product) =>
        filters.categories!.includes(product.category),
      );
    }

    if (filters.priceRange) {
      result = result.filter(
        (product) =>
          product.price >= filters.priceRange!.min &&
          product.price <= filters.priceRange!.max,
      );
    }

    if (filters.minRating) {
      result = result.filter((product) => product.rating >= filters.minRating!);
    }

    if (sortBy === "price-low") {
      result = [...result].sort((first, second) => first.price - second.price);
    }

    if (sortBy === "price-high") {
      result = [...result].sort((first, second) => second.price - first.price);
    }

    if (sortBy === "rating") {
      result = [...result].sort(
        (first, second) => second.rating - first.rating,
      );
    }

    return result;
  }, [products, filters, sortBy]);

  if (isPending) {
    return (
      <section className={gridClasses}>
        {Array.from({ length: 8 }).map((_, index) => (
          <article
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
          >
            <div className="aspect-square animate-pulse rounded-md bg-slate-100" />

            <div className="px-1 pb-1 pt-3">
              <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />

              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-100" />

              <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-slate-100" />

              <div className="mt-3 h-8 animate-pulse rounded-md bg-slate-100" />
            </div>
          </article>
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <div>
        <div className="flex min-h-60 flex-col items-center justify-center gap-4 p-6">
          <p role="alert" className="text-sm text-red-700">
            Products could not be loaded. Check Your the Internet Connection.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!filteredProducts.length) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-6 p-6">
        <p className="text-sm text-slate-600">
          No matching products on this page.
        </p>
        {page < Math.ceil(totalCount / pageSize) && (
          <button
            type="button"
            onClick={() => setPage((current) => current + 1)}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Check next page
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <section className={gridClasses}>
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-md bg-white">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105 sm:p-3"
              />

              <AddtoHeart product={product} variant="detail" />
            </div>

            <div className="px-1 pb-1 pt-2">
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {product.category}
                {product.subCategory && ` · ${product.subCategory}`}
              </p>

              <h2 className="mt-1 truncate text-xs font-semibold text-slate-900 sm:text-sm">
                {product.title}
              </h2>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-xs font-bold text-slate-950 sm:text-sm">
                    {formatRupees(product.price)}
                  </span>
                  {product.actualPrice > product.price && (
                    <span className="text-[10px] text-slate-400 line-through sm:text-xs">
                      {formatRupees(product.actualPrice)}
                    </span>
                  )}
                </div>

                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {product.rating.toFixed(1)}
                </span>
              </div>

              <AddToBag product={product} variant="card" />
            </div>
          </article>
        ))}
      </section>

      <nav
        aria-label="Product pages"
        className="flex flex-wrap items-center justify-center gap-3 px-4 pb-8 sm:gap-4 sm:px-6"
      >
        <button
          type="button"
          disabled={page === 1}
          onClick={() => setPage((current) => Math.max(1, current - 1))}
          className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-slate-600">
          Page {page} of {Math.max(1, Math.ceil(totalCount / pageSize))}
        </span>
        <button
          type="button"
          disabled={page >= Math.ceil(totalCount / pageSize)}
          onClick={() => setPage((current) => current + 1)}
          className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </nav>
    </>
  );
};

export default Products;
