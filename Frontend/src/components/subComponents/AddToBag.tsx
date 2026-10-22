import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/services/products";

interface AddToBagProps {
  product: Product;
  variant?: "card" | "detail";
}

const AddToBag = ({ product, variant = "card" }: AddToBagProps) => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    isInCart,
  } = useCart();

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [isUpdating, setIsUpdating] = useState(false);

  const cartItem = cartItems.find((item) => item.product.id === product.id);

  const inCart = isInCart(product.id);

  // Show the actual cart quantity when the product is already added.
  const displayedQuantity = cartItem?.quantity ?? quantity;

  const handleAddToBag = async () => {
    if (isAuthLoading || isUpdating) return;

    if (!isAuthenticated) {
      toast.message("Please log in first");
      navigate("/login");
      return;
    }

    setIsUpdating(true);

    try {
      await addToCart(product, quantity);

      setQuantity(1);

      toast.success("Product added to your bag", {
        description: `${product.title} × ${quantity}`,
      });
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Could not add the product. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuantityChange = async (action: "increase" | "decrease") => {
    if (isUpdating || isAuthLoading) return;

    // If the product is already in the cart, update MongoDB immediately.
    if (inCart) {
      setIsUpdating(true);

      try {
        if (action === "increase") {
          await increaseQuantity(product.id);
        } else {
          await decreaseQuantity(product.id);
        }
      } catch (error) {
        console.error("Failed to update quantity:", error);
        toast.error("Could not update quantity. Please try again.");
      } finally {
        setIsUpdating(false);
      }

      return;
    }

    // If the product is not in the cart, update the quantity to add.
    if (action === "increase") {
      setQuantity((current) => current + 1);
    } else {
      setQuantity((current) => Math.max(1, current - 1));
    }
  };

  const handleRemoveFromBag = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      await removeFromCart(product.id);
      setQuantity(1);

      toast.success("Product removed from your bag");
    } catch (error) {
      console.error("Failed to remove product:", error);
      toast.error("Could not remove the product. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (variant === "detail") {
    return (
      <div className="mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Quantity</span>

          <div className="flex items-center overflow-hidden rounded-lg border border-slate-300">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={isUpdating || isAuthLoading}
              onClick={() => void handleQuantityChange("decrease")}
              className="p-3 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Minus size={16} />
            </button>

            <span className="min-w-12 text-center text-sm font-semibold">
              {isUpdating ? "..." : displayedQuantity}
            </span>

            <button
              type="button"
              aria-label="Increase quantity"
              disabled={isUpdating || isAuthLoading}
              onClick={() => void handleQuantityChange("increase")}
              className="p-3 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleAddToBag()}
          disabled={isUpdating || isAuthLoading || inCart}
          className={`flex w-full items-center justify-center gap-2 rounded-md border py-3 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${
            inCart
              ? "border-emerald-600 bg-emerald-50 text-emerald-700"
              : "border-slate-950 bg-slate-950 text-white hover:bg-slate-800"
          }`}
        >
          <ShoppingBag size={17} />

          {isUpdating
            ? "PLEASE WAIT..."
            : inCart
              ? "✓ ADDED TO BAG"
              : "ADD TO BAG"}
        </button>

        {inCart && (
          <button
            type="button"
            onClick={() => void handleRemoveFromBag()}
            disabled={isUpdating || isAuthLoading}
            className="w-full rounded-md border border-slate-300 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            REMOVE FROM BAG
          </button>
        )}
      </div>
    );
  }

  // Compact button for product cards.
  return (
    <button
      type="button"
      disabled={isUpdating || isAuthLoading}
      onClick={(event) => {
        event.stopPropagation();

        if (inCart) {
          void handleRemoveFromBag();
        } else {
          void handleAddToBag();
        }
      }}
      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
        inCart
          ? "border-emerald-600 bg-emerald-50 text-emerald-700 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
          : "border-slate-950 bg-slate-950 text-white hover:bg-slate-800"
      }`}
    >
      <ShoppingBag size={15} />

      {isUpdating ? "PLEASE WAIT..." : inCart ? "✓ ADDED TO BAG" : "ADD TO BAG"}
    </button>
  );
};

export default AddToBag;
