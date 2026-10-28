import { Minus, Plus, Trash2 } from "lucide-react";
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
      <main className="min-h-[60vh] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="border-b border-slate-300 pb-7 text-3xl font-semibold">
            Your Cart
          </h1>

          <div className="py-16 text-center text-slate-500">
            Loading your cart...
          </div>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-[60vh] px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <h1 className="border-b border-slate-300 pb-7 text-3xl font-semibold">
            Your Cart
          </h1>

          <div className="mt-12 flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
            <h2 className="text-xl font-medium">Your cart is empty</h2>

            <p className="mt-2 text-sm text-gray-500">
              Add some products to your cart to see them here.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[60vh] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="border-b border-slate-300 pb-7 text-3xl font-semibold">
          Your Cart
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_350px]">
          <div className="space-y-4">
            {cartItems.map((item) => {
              const isUpdating = updatingProductId === item.product.id;

              return (
                <div
                  key={item.product.id}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => handleProductClick(item.product)}
                    aria-label={`View ${item.product.title}`}
                    className="h-28 w-28 shrink-0 rounded-lg"
                  >
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      className="h-full w-full rounded-lg object-contain"
                    />
                  </button>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <button
                        type="button"
                        onClick={() => handleProductClick(item.product)}
                        className="text-left font-medium hover:text-slate-500"
                      >
                        {item.product.title}
                      </button>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatRupees(item.product.price)}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center rounded-lg border border-slate-200">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.product.title}`}
                          disabled={isUpdating || updatingProductId !== null}
                          onClick={() =>
                            void handleQuantityChange(
                              item.product.id,
                              "decrease",
                            )
                          }
                          className="rounded-l-lg p-2 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="min-w-10 text-center text-sm">
                          {isUpdating ? "..." : item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.product.title}`}
                          disabled={isUpdating || updatingProductId !== null}
                          onClick={() =>
                            void handleQuantityChange(
                              item.product.id,
                              "increase",
                            )
                          }
                          className="rounded-r-lg p-2 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        type="button"
                        disabled={isUpdating || updatingProductId !== null}
                        onClick={() => void handleRemove(item.product.id)}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                        {isUpdating ? "Updating..." : "Remove"}
                      </button>
                    </div>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="font-medium">
                      {formatRupees(item.product.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="h-fit rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold">Order Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>{formatRupees(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span>Free</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total products</span>
                <span>{totalItems}</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-semibold">
                    {formatRupees(subtotal)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
