import {
  getProductById as fetchProductById,
  getProducts as fetchProducts,
} from "./products";

export const getProducts = fetchProducts;

export const getProductById = fetchProductById;
