import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

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

const initialFilters: StoreFilters = {
  categories: null,
  priceRange: null,
  minRating: null,
};

const Store = () => {
  const [filters, setFilters] = useState<StoreFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [resultCount, setResultCount] = useState(0);

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col overflow-hidden sm:h-[calc(100dvh-4.5rem)]">
      <UnderNav
        sortBy={sortBy}
        onSortChange={setSortBy}
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
            <FilterSidebar filters={filters} onFiltersChange={setFilters} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-64 shrink-0 overflow-hidden border-r border-slate-200 bg-white md:block">
          <FilterSidebar filters={filters} onFiltersChange={setFilters} />
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
