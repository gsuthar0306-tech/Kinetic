import api from "./api";

export const getProducts = async () => {
  const response = await api.get("/Product/GetAll");
  return response.data;
};

export const getProductById = async (id: number) => {
  const response = await api.get(`/Products/GetById/${id}`);
  return response.data;
};
