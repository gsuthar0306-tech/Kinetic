import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { getElectronicProducts, type Product } from "@/services/products";

type Collection = {
  title: string;
  description: string;
  subCategory: string;
  layout: string;
};

const collections: Collection[] = [
  {
    title: "Performance Computing",
    description: "Workstations built for the most demanding tasks.",
    subCategory: "Laptops",
    layout: "lg:col-span-2",
  },
  {
    title: "High-Fidelity Audio",
    description: "Immersive soundscapes.",
    subCategory: "Speakers & Soundbars",
    layout: "",
  },
  {
    title: "Tablets & Displays",
    description: "Portable screens for everyday work.",
    subCategory: "Tablets",
    layout: "",
  },
  {
    title: "Smartphones",
    description: "Connected technology that moves with you.",
    subCategory: "Smartphones",
    layout: "lg:col-span-2",
  },
];

const Collections = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasError, setHasError] = useState(false);

  const navigate = useNavigate();

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  useEffect(() => {
    let isMounted = true;

    getElectronicProducts(1, 24)
      .then((data) => {
        if (isMounted) setProducts(data.items);
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (hasError) {
    return (
      <p role="alert" className="px-5 py-8 text-center text-sm text-red-700">
        Could not load products for the collections.
      </p>
    );
  }

  return (
    <section className="bg-slate-50 px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
          COLLECTIONS
        </p>

        <h2 className="mt-2 !text-2xl !font-semibold !tracking-[-0.03em] !text-slate-950 sm:!text-3xl">
          Curated Categories
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:grid-rows-[16.75rem_11.25rem]">
          {collections.map((collection) => {
            const product =
              products.find(
                ({ subCategory }) =>
                  subCategory.toLowerCase() ===
                  collection.subCategory.toLowerCase(),
              ) ?? products[collections.indexOf(collection)];

            const image = product?.thumbnail;

            return (
              <article
                key={collection.title}
                className={`group relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-200 sm:aspect-[16/10] lg:aspect-auto ${collection.layout}`}
              >
                {image ? (
                  <img
                    src={image}
                    alt={product?.title ?? collection.title}
                    className="absolute inset-0 h-full w-full bg-white object-contain p-3 transition duration-500 group-hover:scale-105 sm:p-5"
                  />
                ) : (
                  <div
                    className="absolute inset-0 animate-pulse bg-white"
                    aria-label={`Loading ${collection.title}`}
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/10 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {collection.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-200">
                      {collection.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label={`Explore ${collection.title}`}
                    onClick={() => product && handleProductClick(product)}
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-white/25 text-white backdrop-blur transition-colors group-hover:bg-white group-hover:text-slate-950"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Collections;
