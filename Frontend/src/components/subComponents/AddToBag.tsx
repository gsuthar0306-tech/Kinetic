import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/services/products";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router";

interface AddToBagProps {
  product: Product;
  variant?: "card" | "detail";
}

const AddToBag = ({ product, variant = "card" }: AddToBagProps) => {
  const { addToCart, removeFromCart, isInCart } = useCart();

  const inCart = isInCart(product.id);
  const navigate = useNavigate();

  const session = localStorage.getItem("kinetic-session");
  const isLoggedIn = Boolean(session);

  const handleClick = () => {
    if (!isLoggedIn) {
      toast.message("Please Log into KENITEC", {
        description: `You will need to logIN to ADD A product to Your bag`,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }
    if (inCart) {
      removeFromCart(product.id);
      toast.success("Product Removed successfully!", {
        description: `${product.title} has been removed.`,
      });
    } else {
      addToCart(product);
      toast.success("Product Added successfully!", {
        description: `${product.title} is now in your bag.`,
      });
    }
  };

  if (variant === "detail") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-bold transition-colors ${
          inCart
            ? "bg-slate-400 hover:bg-slate-400 outline-2 outline-black"
            : "bg-slate-950 text-white hover:bg-slate-800"
        }`}
      >
        <ShoppingBag className="size-4" />

        {inCart ? "REMOVE FROM BAG" : "ADD TO BAG"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        handleClick();
      }}
      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md border py-2 text-[10px] font-bold tracking-wide transition-colors ${
        inCart
          ? "border-slate-400 bg-slate-400 text-white outline-2 hover:outline-black"
          : "border-slate-950 bg-slate-950 text-white"
      }`}
    >
      <ShoppingBag className="size-3.5" />

      {inCart ? "ADDED TO BAG" : "ADD TO BAG"}
    </button>
  );
};

export default AddToBag;
