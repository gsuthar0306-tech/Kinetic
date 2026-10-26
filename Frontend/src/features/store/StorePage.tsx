import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import FilterSidebar, {
  type StoreFilters,
} from "@/features/store/components/FilterSidebar";

import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
    <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:h-[calc(100dvh-4.5rem)]">
      <UnderNav
        sortBy={sortBy}
        onSortChange={updateSort}
        resultCount={resultCount}
      />

      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 md:hidden">
        <span className="text-sm font-semibold text-slate-900">
          Shop filters
        </span>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="size-4" />
                Filters
              </Button>
            }
          />

          <SheetContent
            side="left"
            className="w-[min(22rem,90vw)] overflow-y-auto p-0"
          >
            <SheetHeader>
              <SheetTitle>Shop filters</SheetTitle>
            </SheetHeader>

            <FilterSidebar filters={filters} onFiltersChange={updateFilters} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 overflow-hidden border-r border-slate-200 bg-white md:block">
          <FilterSidebar filters={filters} onFiltersChange={updateFilters} />
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <Products
            filters={filters}
            sortBy={sortBy}
            onResultCountChange={setResultCount}
          />
        </main>
      </div>
    </div>
  );
};

export default Store;
