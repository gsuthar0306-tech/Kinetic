import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import {
  formatRupees,
  getProductById,
  type Product,
} from "@/services/products";

import AddtoHeart from "@/components/subComponents/AddtoHeart";
import AddToBag from "@/components/subComponents/AddToBag";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [selectedImage, setSelectedImage] = useState("");

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getProductById(id);
        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch (error) {
        console.error("Failed to load product:", error);
        setLoadError(true);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="p-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-xl bg-slate-100" />

          <div className="flex flex-col justify-center">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="mt-6 h-8 w-32 animate-pulse rounded bg-slate-100" />
            <div className="mt-6 h-12 w-full animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-96 flex-col items-center justify-center gap-4 p-6">
        <p role={loadError ? "alert" : undefined} className="text-sm text-slate-500">
          {loadError
            ? "Could not load this product from the backend."
            : "Product not found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/store")}
          className="rounded-md bg-slate-950 px-5 py-2 text-sm font-semibold text-white"
        >
          Back to Store
        </button>
      </main>
    );
  }

  const productImages =
    product.images?.length > 0 ? product.images : [product.thumbnail];

  return (
    <main className="p-4 sm:p-6">
      <button
        type="button"
        onClick={() => navigate("/store")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
      >
        <ArrowLeft className="size-4" />
        Back to Store
      </button>

      <section className="grid gap-10 md:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
            <img
              src={selectedImage}
              alt={product.title}
              className="h-full w-full object-contain p-6"
            />

            <AddtoHeart product={product} variant="detail" />
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto">
            {productImages.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`size-20 shrink-0 overflow-hidden rounded-lg border-2 bg-slate-100 ${
                  selectedImage === image
                    ? "border-slate-950"
                    : "border-transparent"
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

        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            {product.category.replaceAll("-", " ")}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-5 flex items-center gap-3">
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

          <div className="mt-6 flex items-baseline gap-3">
            <p className="text-3xl font-bold text-slate-950">
              {formatRupees(product.price)}
            </p>
            {product.actualPrice > product.price && (
              <p className="text-lg text-slate-400 line-through">
                {formatRupees(product.actualPrice)}
              </p>
            )}
          </div>

          <div className="my-7 h-px bg-slate-200" />

          <div>
            <p className="mb-3 text-sm font-semibold text-slate-900">
              Quantity
            </p>

            <div className="flex w-fit items-center rounded-md border border-slate-300">
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                className="p-3 transition hover:bg-slate-100"
              >
                <Minus className="size-4" />
              </button>

              <span className="min-w-12 text-center text-sm font-semibold">
                {quantity}
              </span>

              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className="p-3 transition hover:bg-slate-100"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <AddToBag product={product} variant="detail" />

          <div className="mt-8 rounded-lg border border-slate-200 p-5">
            <h2 className="text-sm font-bold text-slate-950">
              Product Information
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Category</span>

                <span className="font-medium capitalize text-slate-900">
                  {product.category.replaceAll("-", " ")}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Product ID</span>

                <span className="font-medium text-slate-900">
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

                <span className="font-medium text-slate-900">
                  {product.subCategory}
                </span>
              </div>

              {product.link && (
                <a
                  href={product.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 text-sm font-semibold text-blue-700 underline underline-offset-4"
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
