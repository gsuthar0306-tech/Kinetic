import api from "./api";

export const registerUser = async (data: any) => {
  const response = await api.post("/Users/Create", data);
  return response.data;
};

export const loginUser = async (data: any) => {
  const response = await api.post("/User/Login", data);
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get("Users/GetAll");
  return response.data;
};
