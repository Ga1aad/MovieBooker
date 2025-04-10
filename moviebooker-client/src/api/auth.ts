import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
console.log("API URL:", API_URL); // Pour déboguer

// Créer une instance axios avec la configuration de base
export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
}

interface JwtPayload {
  sub: number;
  email: string;
  username?: string;
}

interface AuthResponse {
  access_token: string;
}

interface RegisterResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    email: string;
    username: string;
  };
}

export const authApi = {
  login: async (
    data: LoginData
  ): Promise<{
    token: string;
    user: { id: number; email: string; username?: string };
  }> => {
    const response = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      data
    );
    const { access_token } = response.data;

    // Décoder le token pour obtenir les informations utilisateur
    const decoded = jwtDecode<JwtPayload>(access_token);

    return {
      token: access_token,
      user: {
        id: decoded.sub,
        email: decoded.email,
        username: decoded.username,
      },
    };
  },

  register: async (data: RegisterData) => {
    const response = await axios.post<RegisterResponse>(
      `${API_URL}/auth/register`,
      data
    );

    // Utiliser directement le token et les données utilisateur de la réponse
    return {
      token: response.data.access_token,
      user: {
        id: response.data.user.id,
        email: response.data.user.email,
        username: response.data.user.username,
      },
    };
  },
};
