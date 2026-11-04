import api from "./api";

interface RefreshUser {
  id?: string;
  Id?: string;
  Firstname?: string;
  firstname?: string;
  Lastname?: string;
  lastname?: string;
  email?: string;
  Email?: string;
  role?: string;
  Role?: string;
}

interface RefreshResponse {
  user?: RefreshUser;
  User?: RefreshUser;
}

let refreshRequest: Promise<RefreshResponse> | null = null;

export interface RegisterData {
  Firstname: string;
  Lastname: string;
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

export function refreshUser(): Promise<RefreshResponse> {
  if (!refreshRequest) {
    refreshRequest = api
      .post("/Users/Refresh")
      .then((response) => response.data as RefreshResponse)
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

export async function logoutUser() {
  const response = await api.post("/Users/Logout");
  return response.data;
}
