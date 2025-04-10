import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

// Définir le type LoginCredentials
interface LoginCredentials {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();

  // Récupérer la page d'origine si elle existe
  const from = location.state?.from || "/";

  // ... reste du code ...
}
