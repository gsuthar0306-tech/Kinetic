import api from "./api";

export interface RegisterData {
  Firstname: string;
  Lastname: string;
  Age: number;
  Number: string;
  Address: string;
  Email: string;
  Password: string;
}

export interface LoginData {
  Email: string;
  Password: string;
}

export async function registerUser(data: RegisterData) {
  const response = await api.post("/Users/Create", data);
  return response.data;
}

export async function loginUser(data: LoginData) {
  const response = await api.post("/Users/Login", data);
  return response.data;
}
