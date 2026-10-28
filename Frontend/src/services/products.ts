import api from "./api";

interface BackendProduct {
  _id: string;
  name: string;
  main_category: string;
  sub_category: string;
  image: string;
  images?: string[];
  link: string;
  ratings: number;
  no_of_ratings: number;
  discount_price: string;
  actual_price: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  thumbnail: string;
  images: string[];
  price: number;
  actualPrice: number;
  discountPrice: string;
  rating: number;
  noOfRatings: number;
  link: string;
}

export interface ProductFilters {
  search?: string;
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
}

export interface PagedProducts {
  items: Product[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export const formatRupees = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

function parsePrice(value: string): number {
  const amount = value.match(/[0-9][0-9,]*(?:\.[0-9]+)?/)?.[0];
  return amount ? Number(amount.replaceAll(",", "")) : 0;
}

function mapProduct(product: BackendProduct): Product {
  const actualPrice = parsePrice(product.actual_price);
  const discountPrice = parsePrice(product.discount_price);

  const images = [
    ...new Set([product.image, ...(product.images ?? [])].filter(Boolean)),
  ];

  return {
    id: product._id,
    title: product.name,
    category: product.main_category,
    subCategory: product.sub_category,
    thumbnail: product.image,
    images,
    price: discountPrice || actualPrice,
    actualPrice,
    discountPrice: product.discount_price,
    rating: product.ratings,
    noOfRatings: product.no_of_ratings,
    link: product.link,
  };
}

export async function getProducts(
  page = 1,
  pageSize = 24,
  filters: ProductFilters = {},
): Promise<PagedProducts> {
  const { data } = await api.get<
    Omit<PagedProducts, "items"> & {
      items: BackendProduct[];
    }
  >("/Products/GetAll", {
    params: {
      page,
      pageSize,
      search: filters.search?.trim() || undefined,
      categories: filters.categories?.join(","),
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      minRating: filters.minRating,
      sort: filters.sort === "recommended" ? undefined : filters.sort,
    },
  });

  return {
    ...data,
    items: data.items.map(mapProduct),
  };
}

export async function getElectronicProducts(
  page = 1,
  pageSize = 24,
  filters: ProductFilters = {},
): Promise<PagedProducts> {
  return getProducts(page, pageSize, filters);
}

export async function getProductCategories(): Promise<string[]> {
  const { data } = await api.get<string[]>("/Products/GetCategories");
  return data;
}

export async function getProductById(id: string): Promise<Product> {
  const { data } = await api.get<BackendProduct>(
    `/Products/GetById/${encodeURIComponent(id)}`,
  );

  return mapProduct(data);
}

export const productKeys = {
  all: ["electronicProducts"] as const,

  list: (page = 1, pageSize = 24, filters: ProductFilters = {}) =>
    ["electronicProducts", page, pageSize, filters] as const,

  categories: ["productCategories"] as const,

  detail: (id: string) => ["productDetails", id] as const,
};
