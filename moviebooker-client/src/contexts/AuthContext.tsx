import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { authApi } from "@/api/auth";
import { useAuth } from "@/lib/hooks/useAuth";
import Cookies from "js-cookie";

interface User {
  id: number;
  email: string;
  username?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    // Vérifier les cookies au chargement de manière sécurisée
    const token = Cookies.get("token");
    const userStr = Cookies.get("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.id && user.email) {
          auth.setAuth(token, user);
        }
      } catch (error) {
        // En cas d'erreur de parsing, on nettoie les cookies
        Cookies.remove("token");
        Cookies.remove("user");
      }
    }
  }, []);

  const value = {
    isAuthenticated: !!auth.token,
    user: auth.user,
    token: auth.token,
    logout: auth.logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
