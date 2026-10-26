import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Star } from "lucide-react";

import { formatRupees, getProductById, productKeys } from "@/services/products";

import AddtoHeart from "@/components/subComponents/AddtoHeart";
import AddToBag from "@/components/subComponents/AddToBag";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState("");

  const handleGoBack = () => {
    const historyIndex = window.history.state?.idx;

    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
    } else {
      navigate("/store");
    }
  };

  const {
    data: product,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: productKeys.detail(id ?? ""),
    queryFn: () => {
      if (!id) {
        throw new Error("Product ID is missing");
      }

      return getProductById(id);
    },
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (product) {
      setSelectedImage(product.thumbnail);
    }
  }, [product]);

  if (isPending) {
    return (
      <main className="mx-auto max-w-[1440px] p-4 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-14">
          <div className="h-72 w-full animate-pulse rounded-xl bg-slate-100 sm:h-80 lg:h-[520px] lg:w-[616px]" />

          <div className="flex max-w-2xl flex-col">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 h-8 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="mt-6 h-8 w-32 animate-pulse rounded bg-slate-100" />
            <div className="mt-6 h-12 w-full animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!id || isError || !product) {
    return (
      <main className="flex min-h-96 flex-col items-center justify-center gap-4 p-6">
        <p
          role={isError ? "alert" : undefined}
          className="text-sm text-slate-500"
        >
          {isError
            ? "Could not load this product from the backend."
            : "Product not found."}
        </p>

        <button
          type="button"
          onClick={handleGoBack}
          className="flex items-center gap-2 rounded-md bg-slate-950 px-5 py-2 text-sm font-semibold text-white"
        >
          <ArrowLeft className="size-4" />
          Go back
        </button>

        {isError && (
          <button
            type="button"
            onClick={() => refetch()}
            className="text-sm font-medium underline"
          >
            Try again
          </button>
        )}
      </main>
    );
  }

  const productImages =
    product.images?.length > 0 ? product.images : [product.thumbnail];

  return (
    <main className="mx-auto max-w-[1440px] p-4 sm:p-6">
      <button
        type="button"
        onClick={handleGoBack}
        className="mb-4 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950 sm:mb-6"
      >
        <ArrowLeft className="size-4" />
        Go back
      </button>

      <section className="grid gap-6 sm:gap-8 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-14">
        <div className="mx-auto flex w-full max-w-xl min-w-0 flex-col gap-3 lg:mx-0 lg:w-auto lg:max-w-none lg:flex-row-reverse lg:gap-4">
          <div className="relative h-72 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-80 lg:size-[520px]">
            <img
              src={selectedImage}
              alt={product.title}
              className="h-full w-full object-contain p-4 sm:p-6"
            />

            <AddtoHeart product={product} variant="detail" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3 lg:max-h-[520px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0">
            {productImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`Show image ${index + 1}`}
                className={`size-14 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-100 sm:size-16 lg:size-[72px] ${
                  selectedImage === image
                    ? "border-slate-950"
                    : "border-transparent hover:border-slate-300"
                }`}
              >
                <img
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 max-w-2xl flex-col">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:text-xs">
            {product.category.replaceAll("-", " ")}
          </p>

          <h1 className="mt-2 text-xl font-bold leading-snug tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">
            {product.title}
          </h1>

          <div className="mt-3 flex items-center gap-3 sm:mt-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`size-4 ${
                    index < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>

            <span className="text-sm font-medium text-slate-500">
              {product.rating.toFixed(1)} / 5
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-x-3 sm:mt-5">
            <p className="text-2xl font-bold text-slate-950 sm:text-3xl">
              {formatRupees(product.price)}
            </p>

            {product.actualPrice > product.price && (
              <p className="text-base text-slate-400 line-through sm:text-lg">
                {formatRupees(product.actualPrice)}
              </p>
            )}
          </div>

          <div className="my-3 h-px bg-slate-200 sm:my-4" />

          <AddToBag product={product} variant="detail" />

          <div className="mt-6 rounded-lg border border-slate-200 p-4 sm:mt-8 sm:p-5">
            <h2 className="text-sm font-bold text-slate-950">
              Product Information
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Category</span>
                <span className="text-right font-medium capitalize text-slate-900">
                  {product.category.replaceAll("-", " ")}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Product ID</span>
                <span className="break-all text-right font-medium text-slate-900">
                  #{product.id}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Rating</span>
                <span className="font-medium text-slate-900">
                  {product.rating.toFixed(1)} / 5
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Number of ratings</span>
                <span className="font-medium text-slate-900">
                  {product.noOfRatings.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Subcategory</span>
                <span className="text-right font-medium text-slate-900">
                  {product.subCategory}
                </span>
              </div>

              {product.link && (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block pt-2 text-sm font-semibold text-blue-700 underline underline-offset-4"
                >
                  View product listing
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;
