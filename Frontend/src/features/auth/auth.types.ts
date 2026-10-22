export type UserRole = "user" | "admin";

export interface AuthUser {
  id: string;
  Firstname: string;
  Lastname: string;
  email: string;
  role: UserRole;
}
