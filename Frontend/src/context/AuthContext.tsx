import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthSession, AuthUser } from "@/features/auth/auth.types";

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (Session: AuthSession) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = "kinetic-session";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (!storedSession) {
      return;
    }

    try {
      const session: AuthSession = JSON.parse(storedSession);

      setUser(session.user);
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const login = (session: AuthSession) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session.user);
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an Authprovider");
  }

  return context;
}
