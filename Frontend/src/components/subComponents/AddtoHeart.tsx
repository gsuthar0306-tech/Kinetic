import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";

import { useFavorites } from "@/context/FavoritesContext";
import { useAuth } from "@/context/AuthContext";
import type { Product } from "@/services/products";

interface AddtoHeartProps {
  product: Product;
  variant?: "card" | "detail";
}

const AddtoHeart = ({ product, variant = "card" }: AddtoHeartProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated, isLoading } = useAuth();

  const navigate = useNavigate();
  const favorite = isFavorite(product.id);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();

    if (isLoading) return;

    if (!isAuthenticated) {
      toast.message("Please log in first", {
        description: "Log in to save products to your favorites.",
      });

      navigate("/login");
      return;
    }

    try {
      await toggleFavorite(product);

      if (favorite) {
        toast.success("Removed from favorites", {
          description: "Product removed from your favorites.",
        });
      } else {
        toast.success("Added to favorites", {
          description: "Product added to your favorites.",
        });
      }
    } catch {
      toast.error("Couldn't update favorites", {
        description: "Please try again.",
      });
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
      onClick={handleClick}
      className={
        variant === "detail"
          ? "absolute right-4 top-4 rounded-full bg-white p-3 shadow-sm transition hover:scale-105 disabled:opacity-60"
          : "rounded-full bg-white p-2 shadow-sm transition hover:scale-105 disabled:opacity-60"
      }
    >
      <Heart
        className={`${variant === "detail" ? "size-5" : "size-4"} ${
          favorite ? "fill-red-500 text-red-500" : "text-slate-950"
        }`}
      />
    </button>
  );
};

export default AddtoHeart;

// import { Heart } from "lucide-react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router";

// import { useFavorites } from "@/context/FavoritesContext";
// import type { Product } from "@/services/products";

// interface AddtoHeartProps {
//   product: Product;
//   variant?: "card" | "detail";
// }

// const AddtoHeart = ({ product, variant = "card" }: AddtoHeartProps) => {
//   const { toggleFavorite, isFavorite } = useFavorites();

//   const navigate = useNavigate();

//   const favorite = isFavorite(product.id);

//   const session = sessionStorage.getItem("kinetic-session");
//   const isLoggedIn = Boolean(session);

//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     event.stopPropagation();

//     if (!isLoggedIn) {
//       navigate("/login");
//       return;
//     }
//     if (favorite) {
//       toggleFavorite(product);

//       toast.success("Removed from favorites", {
//         description: "Product has been removed from your favorites.",
//       });
//     } else {
//       toggleFavorite(product);

//       toast.success("Added to favorites", {
//         description: "Product has been added to your favorites.",
//       });
//     }
//   };

//   if (variant === "detail") {
//     return (
//       <button
//         type="button"
//         aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
//         onClick={handleClick}
//         className="absolute right-4 top-4 rounded-full bg-white p-3 shadow-sm transition hover:scale-105"
//       >
//         <Heart
//           className={`size-5 ${
//             favorite ? "fill-red-500 text-red-500" : "text-slate-950"
//           }`}
//         />
//       </button>
//     );
//   }

//   return (
//     <button
//       type="button"
//       aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
//       onClick={handleClick}
//       className="rounded-full bg-white p-2 shadow-sm transition hover:scale-105"
//     >
//       <Heart
//         className={`size-4 ${
//           favorite ? "fill-red-500 text-red-500" : "text-slate-950"
//         }`}
//       />
//     </button>
//   );
// };

// export default AddtoHeart;
