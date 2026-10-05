export type UserRole = "user" | "admin";

export type AuthUser = {
  id: string;
  Firstname: string;
  Lastname: string;
  email: string;
  role: UserRole;
};

export interface AuthSession {
  token: string;
  refreshToken: string;
  user: AuthUser;
}
