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

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <div>
      {/* Formulaire de connexion */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleLogin({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          });
        }}
      >
        <input type="email" name="email" required />
        <input type="password" name="password" required />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
