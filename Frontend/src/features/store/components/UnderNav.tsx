import { Home, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState, type ComponentProps } from "react";
import { NavLink } from "react-router";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import FilterSidebar from "./FilterSidebar";

export type SortOption = "recommended" | "price-low" | "price-high" | "rating";

interface UnderNavProps extends Pick<
  ComponentProps<typeof FilterSidebar>,
  "filters" | "onFiltersChange"
> {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: low to high", value: "price-low" },
  { label: "Price: high to low", value: "price-high" },
  { label: "Top rated", value: "rating" },
];

const UnderNav = ({
  sortBy,
  onSortChange,
  resultCount,
  filters,
  onFiltersChange,
}: UnderNavProps) => {
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (!filterOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFilterOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filterOpen]);

  const activeFilterCount =
    (filters.categories?.length ?? 0) +
    (filters.priceRange !== null ? 1 : 0) +
    (filters.minRating !== null ? 1 : 0);

  return (
    <>
      {/* Catalog heading with sorting and filtering on the right */}
      <section className="flex flex-col gap-4 bg-white border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8">
        {/* Left side: breadcrumb and heading */}
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="mb-2 flex items-center gap-1.5 text-sm text-slate-500"
          >
            <Home className="size-3.5" />

            <NavLink to="/" className="transition hover:text-slate-900">
              Home
            </NavLink>

            <ChevronRight className="size-3.5 text-slate-300" />

            <NavLink
              to="/store"
              className="text-slate-700 transition hover:text-slate-900"
            >
              Products
            </NavLink>
          </nav>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Product catalog
            </h2>

            <span className="text-sm text-slate-400">
              {resultCount.toLocaleString()} results
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Browse products from our catalog
          </p>
        </div>

        {/* Right side: sort and filter */}
        <div className="flex flex-row shrink-0 items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <span className="hidden whitespace-nowrap text-sm font-medium text-slate-600 sm:inline">
              Sort by
            </span>

            <Select
              value={sortBy}
              onValueChange={(value) => onSortChange(value as SortOption)}
            >
              <SelectTrigger
                aria-label="Sort products"
                className="h-10 w-[min(11rem,48vw)] rounded-md border-slate-200 bg-white text-sm shadow-none sm:w-44"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent
                sideOffset={6}
                className="rounded-md border-slate-200 bg-white shadow-lg"
              >
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="outline"
            aria-expanded={filterOpen}
            aria-controls="store-filter-sidebar"
            onClick={() => setFilterOpen((previous) => !previous)}
            className="shrink-0 gap-2 border-slate-200 bg-white"
          >
            <SlidersHorizontal className="size-4" />
            <span>Filter</span>

            {activeFilterCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </section>

      {/* Transparent backdrop */}
      <button
        type="button"
        aria-label="Close filters"
        tabIndex={filterOpen ? 0 : -1}
        onClick={() => setFilterOpen(false)}
        className={`fixed inset-0 z-40 cursor-default bg-transparent transition-opacity duration-300 ${
          filterOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />

      {/* Scrollable filter sidebar */}
      <aside
        id="store-filter-sidebar"
        aria-label="Product filters"
        aria-hidden={!filterOpen}
        className={`fixed inset-y-0 left-0 z-50 flex w-[320px] max-w-[85vw] flex-col border-r border-slate-200 bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          filterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Filters</h2>
            <p className="text-xs text-slate-500">Refine your products</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close filters"
            onClick={() => setFilterOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <FilterSidebar filters={filters} onFiltersChange={onFiltersChange} />
        </div>
      </aside>
    </>
  );
};

export default UnderNav;
