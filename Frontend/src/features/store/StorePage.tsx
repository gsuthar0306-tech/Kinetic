import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import type { StoreFilters } from "@/features/store/components/FilterSidebar";

import Products from "@/features/store/components/Products";

import UnderNav, {
  type SortOption,
} from "@/features/store/components/UnderNav";

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [resultCount, setResultCount] = useState(0);

  const categories = searchParams.getAll("category");

  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");

  let priceRange: StoreFilters["priceRange"] = null;

  if (minPrice !== null) {
    priceRange = {
      min: Number(minPrice),
      max: maxPrice === null ? Infinity : Number(maxPrice),
    };
  }

  const filters: StoreFilters = {
    categories: categories.length > 0 ? categories : null,
    priceRange,
    minRating: minRating === null ? null : Number(minRating),
  };

  const sortParam = searchParams.get("sort");

  const validSortOptions: SortOption[] = [
    "recommended",
    "price-low",
    "price-high",
    "rating",
  ];

  const sortBy: SortOption = validSortOptions.includes(sortParam as SortOption)
    ? (sortParam as SortOption)
    : "recommended";

  const updateFilters = (nextFilters: StoreFilters) => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.delete("category");

    nextFilters.categories?.forEach((category) => {
      nextParams.append("category", category);
    });

    nextParams.delete("minPrice");
    nextParams.delete("maxPrice");

    if (nextFilters.priceRange) {
      nextParams.set("minPrice", String(nextFilters.priceRange.min));

      if (Number.isFinite(nextFilters.priceRange.max)) {
        nextParams.set("maxPrice", String(nextFilters.priceRange.max));
      }
    }

    if (nextFilters.minRating === null) {
      nextParams.delete("minRating");
    } else {
      nextParams.set("minRating", String(nextFilters.minRating));
    }

    nextParams.delete("page");

    setSearchParams(nextParams);
  };

  const updateSort = (nextSort: SortOption) => {
    const nextParams = new URLSearchParams(searchParams);

    if (nextSort === "recommended") {
      nextParams.delete("sort");
    } else {
      nextParams.set("sort", nextSort);
    }

    nextParams.delete("page");

    setSearchParams(nextParams);
  };

  return (
    <div className="flex flex-col bg-blue-100/10">
      <UnderNav
        sortBy={sortBy}
        onSortChange={updateSort}
        resultCount={resultCount}
        filters={filters}
        onFiltersChange={updateFilters}
      />

      <main className="min-w-0 flex-1">
        <Products
          filters={filters}
          sortBy={sortBy}
          onResultCountChange={setResultCount}
        />
      </main>
    </div>
  );
};

export default Store;
