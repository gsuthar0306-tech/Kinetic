import {
  ArrowRight,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { useCart } from "@/context/CartContext";
import { formatRupees, type Product } from "@/services/products";

const Cart = () => {
  const {
    cartItems,
    isLoading,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const navigate = useNavigate();

  const [updatingProductId, setUpdatingProductId] = useState<string | null>(
    null,
  );

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const savings = cartItems.reduce(
    (total, item) =>
      total +
      Math.max(item.product.actualPrice - item.product.price, 0) *
        item.quantity,
    0,
  );

  const handleQuantityChange = async (
    productId: string,
    action: "increase" | "decrease",
  ) => {
    if (updatingProductId !== null) return;

    setUpdatingProductId(productId);

    try {
      if (action === "increase") {
        await increaseQuantity(productId);
      } else {
        await decreaseQuantity(productId);
      }
    } catch (error) {
      console.error("Failed to update cart quantity:", error);
      toast.error("Could not update quantity. Please try again.");
    } finally {
      setUpdatingProductId(null);
    }
  };

  const handleRemove = async (productId: string) => {
    if (updatingProductId !== null) return;

    setUpdatingProductId(productId);

    try {
      await removeFromCart(productId);
      toast.success("Product removed from your cart.");
    } catch (error) {
      console.error("Failed to remove product from cart:", error);
      toast.error("Could not remove the product. Please try again.");
    } finally {
      setUpdatingProductId(null);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-[60vh] px-3 py-5 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-4 w-36 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-9 w-64 animate-pulse rounded bg-slate-200" />
          <div className="mt-7 grid gap-4 lg:grid-cols-[minmax(0,1fr)_17rem]">
            <div className="h-36 animate-pulse rounded-2xl bg-white" />
            <div className="h-64 animate-pulse rounded-2xl bg-white" />
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-[60vh] px-3 py-5 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">
            Kinetic checkout experience
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Your Shopping Bag
          </h1>

          <div className="mt-8 flex min-h-[340px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <ShoppingBag size={25} />
            </div>
            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Your bag is waiting for something good
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Browse the store and add the products you need. They’ll be ready
              for you here when you are.
            </p>
            <button
              type="button"
              onClick={() => navigate("/store")}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Explore the store <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] px-3 py-5 sm:px-5 sm:py-8 lg:px-6 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              Kinetic checkout experience <span className="text-slate-400">/</span>{" "}
              <span className="text-blue-700">Step 01: review cart</span>
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                Your Shopping Bag
              </h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Review your selected products before you continue.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2.5 sm:max-w-64">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-emerald-600">
              <Truck size={16} />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-900">
                Free delivery included
              </p>
              <p className="text-[10px] leading-4 text-slate-500">
                Shipping is on us with this order.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid min-w-0 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_17rem] xl:gap-6">
          <section aria-label="Items in your shopping bag" className="min-w-0">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-slate-800">
                Review your items
              </h2>
              <button
                type="button"
                onClick={() => navigate("/store")}
                className="text-xs font-medium text-slate-500 transition-colors hover:text-blue-700"
              >
                Continue shopping
              </button>
            </div>
            <div className="space-y-3">
              {cartItems.map((item) => {
                const isUpdating = updatingProductId === item.product.id;
                const hasDiscount =
                  item.product.actualPrice > item.product.price;

                return (
                  <article
                    key={item.product.id}
                    className="flex min-w-0 gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:gap-4 sm:p-4"
                  >
                    <button
                      type="button"
                      onClick={() => handleProductClick(item.product)}
                      aria-label={`View ${item.product.title}`}
                      className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 sm:h-24 sm:w-24"
                    >
                      <img
                        src={item.product.thumbnail}
                        alt={item.product.title}
                        className="h-full w-full object-contain"
                      />
                    </button>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                          {item.product.subCategory ||
                            item.product.category ||
                            "Kinetic product"}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleProductClick(item.product)}
                          className="line-clamp-2 text-left text-sm font-semibold leading-5 text-slate-900 transition-colors hover:text-blue-700 sm:text-[15px]"
                        >
                          {item.product.title}
                        </button>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-sm font-semibold text-slate-900">
                            {formatRupees(item.product.price)}
                          </span>
                          {hasDiscount && (
                            <>
                              <span className="text-xs text-slate-400 line-through">
                                {formatRupees(item.product.actualPrice)}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700">
                                <Tag size={11} />
                                You save{" "}
                                {formatRupees(
                                  item.product.actualPrice -
                                    item.product.price,
                                )}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.product.title}`}
                            disabled={
                              isUpdating || updatingProductId !== null
                            }
                            onClick={() =>
                              void handleQuantityChange(
                                item.product.id,
                                "decrease",
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="min-w-6 text-center text-xs font-semibold text-slate-800">
                            {isUpdating ? "..." : item.quantity}
                          </span>

                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.product.title}`}
                            disabled={
                              isUpdating || updatingProductId !== null
                            }
                            onClick={() =>
                              void handleQuantityChange(
                                item.product.id,
                                "increase",
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${item.product.title} from your bag`}
                          disabled={isUpdating || updatingProductId !== null}
                          onClick={() => void handleRemove(item.product.id)}
                          className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                          <span className="sr-only">
                            {isUpdating ? "Updating..." : "Remove"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="hidden shrink-0 text-right sm:block">
                      <p className="text-sm font-semibold text-slate-900">
                        {formatRupees(item.product.price * item.quantity)}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        Item total
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:sticky lg:top-24">
            <h2 className="text-base font-semibold text-slate-950">
              Order Summary
            </h2>
            <p className="mt-1 text-[11px] text-slate-500">
              Your order, at a glance.
            </p>

            <div className="mt-5 space-y-3 border-b border-slate-100 pb-4">
              <div className="flex justify-between gap-3 text-xs">
                <span className="text-slate-500">Bag subtotal</span>
                <span className="font-medium text-slate-800">
                  {formatRupees(subtotal)}
                </span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between gap-3 text-xs">
                  <span className="text-slate-500">Product savings</span>
                  <span className="font-medium text-emerald-700">
                    −{formatRupees(savings)}
                  </span>
                </div>
              )}
              <div className="flex justify-between gap-3 text-xs">
                <span className="text-slate-500">Shipping</span>
                <span className="font-semibold text-emerald-700">Free</span>
              </div>
              <div className="flex justify-between gap-3 text-xs">
                <span className="text-slate-500">Items</span>
                <span className="font-medium text-slate-800">{totalItems}</span>
              </div>
            </div>

            <div className="flex items-end justify-between gap-3 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Total payable
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  Shipping included
                </p>
              </div>
              <p className="text-xl font-bold tracking-tight text-slate-950">
                {formatRupees(subtotal)}
              </p>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Continue to checkout <ArrowRight size={16} />
            </button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck size={13} />
              Secure checkout experience
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Check size={13} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-slate-800">
                    Free delivery
                  </p>
                  <p className="text-[10px] leading-4 text-slate-500">
                    Shipping is included in your total.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <ShieldCheck size={13} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-slate-800">
                    Shop with confidence
                  </p>
                  <p className="text-[10px] leading-4 text-slate-500">
                    Your bag is saved to your account.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Cart;
