import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { AuthSession, AuthUser } from "@/features/auth/auth.types";

import {
  getAuthSession,
  removeAuthSession,
  saveAuthSession,
} from "@/features/auth/authStorage";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (session: AuthSession) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<AuthSession | null>(() =>
    getAuthSession(),
  );

  const login = (newSession: AuthSession) => {
    saveAuthSession(newSession);
    setSession(newSession);
  };

  const logout = () => {
    removeAuthSession();
    setSession(null);
  };

  const value: AuthContextType = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    refreshToken: session?.refreshToken ?? null,
    isAuthenticated: session !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
