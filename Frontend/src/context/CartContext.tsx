import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "@/services/products";
import { useAuth } from "@/context/AuthContext";
import {
  addCartItem,
  getCart,
  removeCartItem,
  updateCartQuantity,
  type CartItem,
} from "@/services/cartApi";

interface CartContextType {
  cartItems: CartItem[];
  isLoading: boolean;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  increaseQuantity: (productId: string) => Promise<void>;
  decreaseQuantity: (productId: string) => Promise<void>;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCart() {
      if (isAuthLoading) {
        return;
      }

      if (!isAuthenticated || !user) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const items = await getCart();

        if (isMounted) {
          setCartItems(items);
        }
      } catch (error) {
        console.error("Failed to load cart:", error);

        if (isMounted) {
          setCartItems([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCart();

    return () => {
      isMounted = false;
    };
  }, [user?.id, isAuthenticated, isAuthLoading, user]);

  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated || !user) {
      throw new Error("You must be logged in to modify your cart.");
    }

    const updatedCart = await addCartItem(product.id, quantity);

    setCartItems(updatedCart);
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated || !user) {
      throw new Error("You must be logged in to modify your cart.");
    }

    const updatedCart = await removeCartItem(productId);

    setCartItems(updatedCart);
  };

  const increaseQuantity = async (productId: string) => {
    if (!isAuthenticated || !user) {
      throw new Error("You must be logged in to modify your cart.");
    }

    const item = cartItems.find(
      (cartItem) => cartItem.product.id === productId,
    );

    if (!item) {
      throw new Error("Product was not found in your cart.");
    }

    const updatedCart = await updateCartQuantity(productId, item.quantity + 1);

    setCartItems(updatedCart);
  };
  const decreaseQuantity = async (productId: string) => {
    if (!isAuthenticated || !user) {
      throw new Error("You must be logged in to modify your cart.");
    }

    const item = cartItems.find(
      (cartItem) => cartItem.product.id === productId,
    );

    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
      const updatedCart = await removeCartItem(productId);
      setCartItems(updatedCart);
      return;
    }

    const updatedCart = await updateCartQuantity(productId, item.quantity - 1);

    setCartItems(updatedCart);
  };

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.product.id === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isLoading: isLoading || isAuthLoading,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart must be used inside a CartProvider");
  }

  return context;
}
