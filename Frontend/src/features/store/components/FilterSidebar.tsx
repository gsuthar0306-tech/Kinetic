import { useState } from "react";
import { X } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";

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

const categories: Category[] = [
  { label: "Computers & Laptops", value: "laptops" },
  { label: "Smartphones", value: "smartphones" },
  { label: "Tablets", value: "tablets" },
  { label: "Mobile Accessories", value: "mobile-accessories" },
];

const priceRanges: { label: string; value: PriceRange }[] = [
  { label: "Under $100", value: { min: 0, max: 99 } },
  { label: "$100 to $500", value: { min: 100, max: 500 } },
  { label: "$500 to $1,000", value: { min: 500, max: 1000 } },
  { label: "$1,000 & above", value: { min: 1000, max: Infinity } },
];

const ratings = [4.5, 4, 3.5];

const FilterSidebar = ({
  filters,
  onFiltersChange,
}: FilterSidebarProps) => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 4);

  const handleCategoryChange = (category: string) => {
    const currentCategories = filters.categories || [];

    if (currentCategories.includes(category)) {
      const updatedCategories = currentCategories.filter(
        (item) => item !== category
      );

      onFiltersChange({
        ...filters,
        categories:
          updatedCategories.length > 0 ? updatedCategories : null,
      });

      return;
    }

    const updatedCategories = [...currentCategories, category];

    onFiltersChange({
      ...filters,
      categories: updatedCategories,
    });
  };

  const handlePriceChange = (priceRange: PriceRange) => {
    const isSamePrice =
      filters.priceRange?.min === priceRange.min &&
      filters.priceRange?.max === priceRange.max;

    if (isSamePrice) {
      onFiltersChange({
        ...filters,
        priceRange: null,
      });

      return;
    }

    onFiltersChange({
      ...filters,
      priceRange: priceRange,
    });
  };

  const handleRatingChange = (rating: number) => {
    if (filters.minRating === rating) {
      onFiltersChange({
        ...filters,
        minRating: null,
      });

      return;
    }

    onFiltersChange({
      ...filters,
      minRating: rating,
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
    filters.categories !== null ||
    filters.priceRange !== null ||
    filters.minRating !== null;

  return (
    <aside className="w-full">
      <section className="p-4">
        <div className="border-b border-slate-300 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">ACTIVE FILTER</h3>

            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-blue-500 hover:bg-blue-100 rounded-full px-2 py-1"
            >
              Clear ALL
            </button>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {filters.categories?.map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-1 rounded-full bg-blue-500 px-2 py-1 text-xs text-white"
                >
                  <span>
                    {categories.find(
                      (item) => item.value === category
                    )?.label}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className="flex h-4 w-4 items-center justify-center rounded hover:bg-blue-600"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}

              {filters.priceRange && (
                <div className="flex items-center gap-1 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                  <span>Price</span>

                  <button
                    type="button"
                    onClick={() =>
                      handlePriceChange(filters.priceRange!)
                    }
                    className="flex h-4 w-4 items-center justify-center rounded hover:bg-blue-600"
                    aria-label="Remove price filter"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}

              {filters.minRating && (
                <div className="flex items-center gap-1 rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                  <span>{filters.minRating}+ stars</span>

                  <button
                    type="button"
                    onClick={() =>
                      handleRatingChange(filters.minRating!)
                    }
                    className="flex h-4 w-4 items-center justify-center rounded hover:bg-blue-600"
                    aria-label="Remove rating filter"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <Accordion defaultValue={["categories"]}>
          <AccordionItem value="categories">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              Categories
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-2">
                {visibleCategories.map((category) => (
                  <div
                    key={category.value}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={category.value}
                        checked={
                          filters.categories?.includes(category.value) ??
                          false
                        }
                        onCheckedChange={() =>
                          handleCategoryChange(category.value)
                        }
                      />

                      <label
                        htmlFor={category.value}
                        className="cursor-pointer text-sm text-slate-600"
                      >
                        {category.label}
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {categories.length > 4 && (
                <button
                  type="button"
                  onClick={() =>
                    setShowAllCategories(!showAllCategories)
                  }
                  className="mt-3 text-sm font-medium text-blue-500 hover:underline"
                >
                  {showAllCategories ? "Show less" : "Show more"}
                </button>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion defaultValue={["price"]}>
          <AccordionItem value="price">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              Price
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-2">
                {priceRanges.map((range) => {
                  const checked =
                    filters.priceRange?.min === range.value.min &&
                    filters.priceRange?.max === range.value.max;

                  return (
                    <div
                      key={range.label}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={`price-${range.value.min}`}
                        checked={checked}
                        onCheckedChange={() =>
                          handlePriceChange(range.value)
                        }
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

        <Accordion defaultValue={["rating"]}>
          <AccordionItem value="rating">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              Customer rating
            </AccordionTrigger>

            <AccordionContent>
              <div className="space-y-2">
                {ratings.map((rating) => (
                  <div key={rating} className="flex items-center gap-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={filters.minRating === rating}
                      onCheckedChange={() =>
                        handleRatingChange(rating)
                      }
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
    </aside>
  );
};

export default FilterSidebar;