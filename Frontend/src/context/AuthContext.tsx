import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { AuthUser, UserRole } from "@/features/auth/auth.types";
import { refreshUser, logoutUser } from "@/services/authApi";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const response = await refreshUser();
        const payload = response?.data ?? response;
        const userData = payload?.user ?? payload?.User;

        if (!userData?.id && !userData?.Id) {
          throw new Error("The server did not return user information.");
        }

        const restoredUser: AuthUser = {
          id: userData.id ?? userData.Id,
          Firstname: userData.Firstname ?? userData.firstname ?? "",
          Lastname: userData.Lastname ?? userData.lastname ?? "",
          email: userData.email ?? userData.Email ?? "",
          role: String(
            userData.role ?? userData.Role ?? "user",
          ).toLowerCase() as UserRole,
          // ).toLowerCase() as AuthUser["role"],
        };

        if (isMounted) {
          setUser(restoredUser);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  function login(newUser: AuthUser) {
    setUser(newUser);
  }

  async function logout() {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
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
