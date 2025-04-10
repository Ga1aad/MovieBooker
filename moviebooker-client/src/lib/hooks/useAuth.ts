import { create } from "zustand";
import Cookies from "js-cookie";
import { authApi } from "@/api/auth";

interface User {
  id: number;
  email: string;
  username?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  login: (credentials: LoginCredentials) => Promise<void>;
}

const getInitialState = () => {
  try {
    const token = Cookies.get("token");
    const userStr = Cookies.get("user");

    if (!token || !userStr) return { token: null, user: null };

    const user = JSON.parse(userStr);
    if (!user || !user.id || !user.email) {
      Cookies.remove("token");
      Cookies.remove("user");
      return { token: null, user: null };
    }

    return { token, user };
  } catch {
    Cookies.remove("token");
    Cookies.remove("user");
    return { token: null, user: null };
  }
};

export const useAuth = create<AuthState>((set) => ({
  ...getInitialState(),
  setAuth: (token, user) => {
    Cookies.set("token", token);
    Cookies.set("user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    Cookies.remove("token");
    Cookies.remove("user");
    set({ token: null, user: null });
  },
  login: async (credentials) => {
    const response = await authApi.login(credentials);
    const { token, user } = response;
    Cookies.set("token", token);
    Cookies.set("user", JSON.stringify(user));
    set({ token, user });
  },
}));
