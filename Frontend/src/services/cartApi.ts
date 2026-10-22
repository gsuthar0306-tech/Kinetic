import api from "@/services/api";
import type { Product } from "@/services/products";

interface BackendCartProduct {
  id: string;
  link?: string;
  name: string;
  mainCategory: string;
  subCategory: string;
  image: string;
  images: string[];
  discountPrice: string;
  actualPrice: string;
  rating: number;
  noOfRatings: number;
}

interface BackendCartItem {
  productId: string;
  quantity: number;
  product: BackendCartProduct;
}

interface BackendCartResponse {
  items: BackendCartItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

function parsePrice(value: string): number {
  const cleanedValue = value.replace(/[₹,\s]/g, "");
  const price = Number(cleanedValue);

  return Number.isFinite(price) ? price : 0;
}

function mapProduct(product: BackendCartProduct): Product {
  return {
    id: product.id,
    link: product.link ?? product.id,
    title: product.name,
    category: product.mainCategory,
    subCategory: product.subCategory,
    thumbnail: product.image,
    images: product.images ?? [],
    price: parsePrice(product.discountPrice || product.actualPrice),
    actualPrice: parsePrice(product.actualPrice),
    discountPrice: product.discountPrice,
    rating: product.rating ?? 0,
    noOfRatings: product.noOfRatings ?? 0,
  };
}

function mapCart(response: BackendCartResponse): CartItem[] {
  return (response.items ?? []).map((item) => ({
    product: mapProduct(item.product),
    quantity: item.quantity,
  }));
}

export async function getCart(): Promise<CartItem[]> {
  const response = await api.get<BackendCartResponse>("/Cart/Get");
  return mapCart(response.data);
}

export async function addCartItem(
  productId: string,
  quantity = 1,
): Promise<CartItem[]> {
  const response = await api.post<BackendCartResponse>("/Cart/Add", {
    productId,
    quantity,
  });

  return mapCart(response.data);
}

export async function updateCartQuantity(
  productId: string,
  quantity: number,
): Promise<CartItem[]> {
  const response = await api.put("/Cart/Quantity", {
    productId,
    quantity,
  });

  return mapCart(response.data);
}

export async function removeCartItem(productId: string): Promise<CartItem[]> {
  await api.delete(`/Cart/Remove/${encodeURIComponent(productId)}`);

  return getCart();
}

export async function clearCart(): Promise<CartItem[]> {
  const response = await api.delete<BackendCartResponse>("/Cart/Clear");
  return mapCart(response.data);
}
