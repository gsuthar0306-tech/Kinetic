import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router";

import {
  formatRupees,
  getElectronicProducts,
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

const Products = ({ filters, sortBy, onResultCountChange }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const pageSize = 24;

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getElectronicProducts(
          page,
          pageSize,
          filters.categories ?? undefined,
        );
        if (isMounted) {
          setProducts(data.items);
          setTotalCount(data.totalCount);
          onResultCountChange(data.totalCount);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        if (isMounted) setLoadError("Products could not be loaded.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [filters.categories, onResultCountChange, page, retryCount]);

  useEffect(() => {
    setPage(1);
  }, [filters, sortBy]);

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
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

  if (loading) {
    return (
      <section className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            key={index}
            className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm sm:p-3"
          >
            <div className="aspect-square animate-pulse rounded-md bg-slate-100" />

            <div className="px-1 pb-1 pt-3">
              <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />

              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-slate-100" />

              <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-slate-100" />

              <div className="mt-3 h-9 animate-pulse rounded-md bg-slate-100" />
            </div>
          </article>
        ))}
      </section>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center gap-4 p-6">
        <p role="alert" className="text-sm text-red-700">
          {loadError} Check that the backend is running, then try again.
        </p>
        <button
          type="button"
          onClick={() => setRetryCount((current) => current + 1)}
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Retry
        </button>
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
      <section className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-2 shadow-sm transition-shadow hover:shadow-md sm:p-3"
          >
            <div className="relative flex h-64 w-full items-center justify-center overflow-hidden rounded-md bg-white sm:h-72 lg:h-80">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="h-full w-full object-contain p-4 transition duration-300 group-hover:scale-105"
              />

              <AddtoHeart product={product} variant="detail" />
            </div>

            <div className="px-1 pb-1 pt-3">
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                {product.category}
                {product.subCategory && ` · ${product.subCategory}`}
              </p>

              <h2 className="mt-1 min-h-10 truncate text-sm font-semibold text-slate-900">
                {product.title}
              </h2>

              <div className="mt-2 flex items-center justify-between">
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
                  {product.rating.toFixed(1)}
                </span>
              </div>

              <AddToBag product={product} variant="card" />
            </div>
            {/* <a href={product.link} onClick={(event) => event.stopPropagation()}>
              By here
            </a> */}
          </article>
        ))}
      </section>

      <nav
        aria-label="Product pages"
        className="flex items-center justify-center gap-4 px-6 pb-8"
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
