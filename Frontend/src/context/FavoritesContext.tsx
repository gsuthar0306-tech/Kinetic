import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "@/context/AuthContext";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "@/services/favorites";
import type { Product } from "@/services/products";

interface FavoritesContextType {
  favorites: Product[];
  isLoading: boolean;
  toggleFavorite: (product: Product) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | null>(null);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { isAuthenticated } = useAuth();

  const [favorites, setFavorites] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadFavorites() {
      if (!isAuthenticated) {
        setFavorites([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const products = await getFavorites();

        if (isActive) {
          setFavorites(products);
        }
      } catch (error) {
        if (isActive) {
          console.error("Failed to load favorites:", error);
          setFavorites([]);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadFavorites();

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

  const toggleFavorite = async (product: Product): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error("Please log in to manage your favorites.");
    }

    const alreadyFavorite = favorites.some(
      (favorite) => favorite.id === product.id,
    );

    try {
      const updatedFavorites = alreadyFavorite
        ? await removeFavorite(product.id)
        : await addFavorite(product.id);

      setFavorites(updatedFavorites);
    } catch (error) {
      console.error("Failed to update favorites:", error);
      throw error;
    }
  };

  const isFavorite = (productId: string): boolean => {
    return favorites.some((favorite) => favorite.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isLoading,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (context === null) {
    throw new Error("useFavorites must be used inside a FavoritesProvider");
  }

  return context;
}
