import { Home, ChevronRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type SortOption = "recommended" | "price-low" | "price-high" | "rating";

interface UnderNavProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
}

const sortOptions: {
  label: string;
  value: SortOption;
}[] = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: low to high", value: "price-low" },
  { label: "Price: high to low", value: "price-high" },
  { label: "Top rated", value: "rating" },
];

const UnderNav = ({ sortBy, onSortChange, resultCount }: UnderNavProps) => {
  return (
    <section className="shrink-0 border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
      <nav
        aria-label="Breadcrumb"
        className="mb-1 flex items-center gap-1.5 text-sm text-slate-500"
      >
        <Home className="size-3.5" />

        <span>Home</span>

        <ChevronRight className="size-3.5 text-slate-300" />

        <span className="text-slate-700">Electronics</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Computing gear
            </h2>

            <span className="text-sm text-slate-400">
              {resultCount.toLocaleString()} results
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Browse computing products
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-3 text-sm sm:w-auto sm:justify-start">
          <span className="whitespace-nowrap text-slate-600 font-bold">
            Sort by:
          </span>

          <Select
            value={sortBy}
            onValueChange={(value) => onSortChange(value as SortOption)}
          >
            <SelectTrigger className="h-10 w-[min(10.625rem,55vw)] rounded-md border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 shadow-sm transition hover:border-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-100">
              <SelectValue />
            </SelectTrigger>

            <SelectContent
              sideOffset={6}
              className="w-[170px] rounded-md border border-slate-200 bg-white p-1 shadow-lg"
            >
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="h-9 cursor-pointer rounded-sm px-3 text-sm text-slate-700 outline-none focus:bg-slate-100 focus:text-slate-900 data-[state=checked]:bg-slate-50"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default UnderNav;
