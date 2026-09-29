import axios from "axios";

export interface Product {
  id: number;
  title: string;
  category: string;
  thumbnail: string;
  images: string[];
  price: number;
  rating: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

const electronicsCategories = new Set<string>([
  "laptops",
  "smartphones",
  "tablets",
  "mobile-accessories",
]);

export const electronicsStoreCategories: string[] = [
  "All Electronics",

  "Computers & Laptops",
  "PC Components",
  "Monitors",
  "Storage",

  "Smartphones",
  "Tablets",
  "Mobile Accessories",

  "Keyboards",
  "Mice",
  "Webcams",
  "Chargers & Cables",

  "Headphones",
  "Earbuds",
  "Speakers",

  "TV & Home Entertainment",

  "Gaming",
  "Gaming Accessories",

  "Cameras",

  "Networking",

  "Smart Home",
  "Smart Watches",

  "Printers & Scanners",
];

const productsApi = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10_000,
});

export async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await productsApi.get<ProductsResponse>("/products", {
      params: {
        limit: 0,
        select: "id,title,category,thumbnail,images,price,rating",
      },
    });

    return data.products ?? [];
  } catch (error) {
    console.error("Failed to fetch products:", error);

    return [];
  }
}

export async function getElectronicProducts(): Promise<Product[]> {
  const products = await getProducts();

  return products.filter((product) =>
    electronicsCategories.has(product.category),
  );
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const { data } = await productsApi.get<Product>(`/products/${id}`);

    return data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}
