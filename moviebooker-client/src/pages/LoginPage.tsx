import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthContext();

  // Récupérer la page d'origine si elle existe
  const from = location.state?.from || "/";

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      // Rediriger vers la page d'origine après la connexion
      navigate(from, { replace: true });
    } catch (error) {
      // Gérer l'erreur...
    }
  };

  // ... reste du code ...
}
