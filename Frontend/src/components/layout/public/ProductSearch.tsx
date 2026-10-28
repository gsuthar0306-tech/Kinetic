import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "debounce";
import { useNavigate, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Search } from "lucide-react";

import {
  formatRupees,
  getElectronicProducts,
  productKeys,
} from "@/services/products";

function ProductSearch() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const updateDebouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value.trim());
      }, 300),
    [],
  );

  useEffect(() => {
    return () => {
      updateDebouncedSearch.clear();
    };
  }, [updateDebouncedSearch]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const { data, isFetching, isError } = useQuery({
    queryKey: [...productKeys.all, "suggestions", debouncedSearch],
    queryFn: () => getElectronicProducts(1, 6, { search: debouncedSearch }),
    enabled: debouncedSearch.length >= 2 && isOpen,
    staleTime: 60 * 1000,
  });

  const suggestions = data?.items ?? [];

  const openStoreSearch = (value: string) => {
    const search = value.trim();

    if (!search) return;

    const params = new URLSearchParams(
      location.pathname === "/store" ? location.search : "",
    );

    params.set("search", search);
    params.delete("page");

    setIsOpen(false);
    navigate(`/store?${params.toString()}`);
  };

  const openProduct = (id: string) => {
    updateDebouncedSearch.clear();
    setIsOpen(false);
    setSearchText("");
    setDebouncedSearch("");
    navigate(`/product/${id}`);
  };

  return (
    <div ref={searchRef} className="relative w-full md:max-w-xs">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          updateDebouncedSearch.clear();
          openStoreSearch(searchText);
        }}
        className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-slate-500"
      >
        <Search className="size-4 shrink-0" />

        <input
          value={searchText}
          onChange={(event) => {
            const value = event.target.value;

            setSearchText(value);
            updateDebouncedSearch(value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          type="search"
          placeholder="Search products"
          aria-label="Search products"
          aria-expanded={isOpen && debouncedSearch.length >= 2}
          autoComplete="off"
        />

        {isFetching && (
          <LoaderCircle className="size-4 shrink-0 animate-spin" />
        )}
      </form>

      {isOpen && debouncedSearch.length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-[110] mt-2 flex max-h-[min(70vh,28rem)] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {isFetching && suggestions.length === 0 && (
              <p className="px-4 py-3 text-sm text-slate-500">
                Searching products...
              </p>
            )}

            {isError && (
              <p className="px-4 py-3 text-sm text-red-600">
                Could not load suggestions. Please try again.
              </p>
            )}

            {!isFetching && !isError && suggestions.length === 0 && (
              <p className="px-4 py-3 text-sm text-slate-500">
                No matching products found.
              </p>
            )}

            {suggestions.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => openProduct(product.id)}
                className="flex w-full items-center gap-3 border-b border-slate-100 px-3 py-3 text-left transition-colors hover:bg-slate-50"
              >
                <img
                  src={product.thumbnail}
                  alt=""
                  className="size-12 shrink-0 rounded-lg border border-slate-100 bg-white object-contain p-1"
                />

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {product.title}
                  </span>

                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {product.category}
                    {product.subCategory && ` · ${product.subCategory}`}
                  </span>

                  <span className="mt-1 block text-sm font-semibold text-slate-900">
                    {formatRupees(product.price)}
                  </span>
                </span>
              </button>
            ))}
          </div>

          {!isError && (
            <button
              type="button"
              onClick={() => openStoreSearch(searchText)}
              className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View all results for "{searchText.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductSearch;
