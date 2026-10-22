import api from "./api";
import type { Product } from "./products";

interface BackendFavorite {
  _id?: string;
  id?: string;

  name: string;

  main_category?: string;
  mainCategory?: string;

  sub_category?: string;
  subCategory?: string;

  image: string;
  images?: string[] | null;
  link?: string;

  ratings?: number | string;
  no_of_ratings?: number | string;
  noOfRatings?: number | string;

  discount_price?: string;
  discountPrice?: string;

  actual_price?: string;
  actualPrice?: string;
}

function parsePrice(price?: string): number {
  if (!price) return 0;

  const cleanedPrice = price.replace(/[^\d.]/g, "");
  return Number(cleanedPrice) || 0;
}

function mapFavoriteProduct(product: BackendFavorite): Product {
  const discountPrice = product.discountPrice ?? product.discount_price ?? "";
  const actualPrice = product.actualPrice ?? product.actual_price ?? "";

  return {
    id: product.id ?? product._id ?? "",
    title: product.name,
    category: product.mainCategory ?? product.main_category ?? "",
    subCategory: product.subCategory ?? product.sub_category ?? "",
    thumbnail: product.image,
    images: product.images ?? [],
    price: parsePrice(discountPrice || actualPrice),
    actualPrice: parsePrice(actualPrice),
    discountPrice,
    rating: Number(product.ratings) || 0,
    noOfRatings: Number(product.noOfRatings ?? product.no_of_ratings ?? 0),
    link: product.link ?? "",
  };
}

function mapFavorites(products: BackendFavorite[]): Product[] {
  return products
    .map(mapFavoriteProduct)
    .filter((product) => product.id !== "");
}

export async function getFavorites(): Promise<Product[]> {
  const { data } = await api.get<BackendFavorite[]>("/Favorites/Get");
  return mapFavorites(data);
}

export async function addFavorite(productId: string): Promise<Product[]> {
  const { data } = await api.post<BackendFavorite[]>("/Favorites/Add", {
    productId,
  });

  return mapFavorites(data);
}

export async function removeFavorite(productId: string): Promise<Product[]> {
  const { data } = await api.delete<BackendFavorite[]>(
    `/Favorites/Remove/${encodeURIComponent(productId)}`,
  );

  return mapFavorites(data);
}

export async function clearFavorites(): Promise<Product[]> {
  const { data } = await api.delete<BackendFavorite[]>("/Favorites/Clear");
  return mapFavorites(data);
}
