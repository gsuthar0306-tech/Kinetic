import { useState } from "react";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getProductCategories, productKeys } from "@/services/products";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Category {
  label: string;
  value: string;
}

interface PriceRange {
  min: number;
  max: number;
}

export interface StoreFilters {
  categories: string[] | null;
  priceRange: PriceRange | null;
  minRating: number | null;
}

interface FilterSidebarProps {
  filters: StoreFilters;
  onFiltersChange: (filters: StoreFilters) => void;
}

const priceRanges: { label: string; value: PriceRange }[] = [
  { label: "Under ₹1,000", value: { min: 0, max: 999 } },
  { label: "₹1,000 to ₹5,000", value: { min: 1000, max: 5000 } },
  { label: "₹5,000 to ₹10,000", value: { min: 5000, max: 10000 } },
  { label: "₹10,000 & above", value: { min: 10000, max: Infinity } },
];

const ratings = [4.5, 4, 3.5];

const FilterSidebar = ({ filters, onFiltersChange }: FilterSidebarProps) => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const { data: categoryData = [] } = useQuery({
    queryKey: productKeys.categories,
    queryFn: getProductCategories,
    staleTime: 30 * 60 * 1000,
  });

  const categories: Category[] = categoryData.map((category) => ({
    label: category,
    value: category,
  }));

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 4);

  const handleCategoryChange = (category: string) => {
    const currentCategories = filters.categories ?? [];

    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter((item) => item !== category)
      : [...currentCategories, category];

    onFiltersChange({
      ...filters,
      categories: updatedCategories.length > 0 ? updatedCategories : null,
    });
  };

  const handlePriceChange = (priceRange: PriceRange) => {
    const isSamePrice =
      filters.priceRange?.min === priceRange.min &&
      filters.priceRange?.max === priceRange.max;

    onFiltersChange({
      ...filters,
      priceRange: isSamePrice ? null : priceRange,
    });
  };

  const handleRatingChange = (rating: number) => {
    onFiltersChange({
      ...filters,
      minRating: filters.minRating === rating ? null : rating,
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      categories: null,
      priceRange: null,
      minRating: null,
    });
  };

  const hasActiveFilters =
    (filters.categories?.length ?? 0) > 0 ||
    filters.priceRange !== null ||
    filters.minRating !== null;

  return (
    <div className="w-full bg-white">
      <section className="p-4">
        {/* Active filters */}
        <div className="border-b border-slate-200 pb-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold">ACTIVE FILTERS</h3>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAll}
                className="rounded-full px-2 py-1 text-xs text-blue-600 hover:bg-blue-50"
              >
                Clear all
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.categories?.map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-xs text-white"
                >
                  <span>
                    {categories.find((item) => item.value === category)
                      ?.label ?? category}
                  </span>

                  <button
                    type="button"
                    aria-label={`Remove ${category} filter`}
                    onClick={() => handleCategoryChange(category)}
                    className="flex size-4 items-center justify-center rounded-full hover:bg-blue-700"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}

              {filters.priceRange && (
                <div className="flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                  <span>
                    {priceRanges.find(
                      (range) =>
                        range.value.min === filters.priceRange?.min &&
                        range.value.max === filters.priceRange?.max,
                    )?.label ?? "Price"}
                  </span>

                  <button
                    type="button"
                    aria-label="Remove price filter"
                    onClick={() => handlePriceChange(filters.priceRange!)}
                    className="flex size-4 items-center justify-center rounded-full hover:bg-blue-700"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}

              {filters.minRating !== null && (
                <div className="flex items-center gap-1 rounded-full bg-blue-600 px-2 py-1 text-xs text-white">
                  <span>{filters.minRating}+ stars</span>

                  <button
                    type="button"
                    aria-label="Remove rating filter"
                    onClick={() => handleRatingChange(filters.minRating!)}
                    className="flex size-4 items-center justify-center rounded-full hover:bg-blue-700"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Categories */}
        <Accordion defaultValue={["categories"]}>
          <AccordionItem value="categories">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              Categories
            </AccordionTrigger>

            <AccordionContent>
              {categories.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No categories available.
                </p>
              ) : (
                <div className="space-y-3">
                  {visibleCategories.map((category) => (
                    <div
                      key={category.value}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={`category-${category.value}`}
                        checked={
                          filters.categories?.includes(category.value) ?? false
                        }
                        onCheckedChange={() =>
                          handleCategoryChange(category.value)
                        }
                      />

                      <label
                        htmlFor={`category-${category.value}`}
                        className="cursor-pointer break-words text-sm text-slate-600"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}

                  {categories.length > 4 && (
                    <button
                      type="button"
                      onClick={() =>
                        setShowAllCategories((previous) => !previous)
                      }
                      className="mt-1 text-sm font-medium text-blue-600 hover:underline"
                    >
                      {showAllCategories ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Price */}
        <Accordion defaultValue={["price"]}>
          <AccordionItem value="price">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              Price
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-3">
                {priceRanges.map((range) => {
                  const checked =
                    filters.priceRange?.min === range.value.min &&
                    filters.priceRange?.max === range.value.max;

                  return (
                    <div key={range.label} className="flex items-center gap-2">
                      <Checkbox
                        id={`price-${range.value.min}`}
                        checked={checked}
                        onCheckedChange={() => handlePriceChange(range.value)}
                      />

                      <label
                        htmlFor={`price-${range.value.min}`}
                        className="cursor-pointer text-sm text-slate-600"
                      >
                        {range.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Customer rating */}
        <Accordion defaultValue={["rating"]}>
          <AccordionItem value="rating">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              Customer rating
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-3">
                {ratings.map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={filters.minRating === rating}
                      onCheckedChange={() => handleRatingChange(rating)}
                    />

                    <label
                      htmlFor={`rating-${rating}`}
                      className="cursor-pointer text-sm text-slate-600"
                    >
                      {rating}+ stars
                    </label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};

export default FilterSidebar;
