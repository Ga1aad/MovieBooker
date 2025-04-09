import { useAuthContext } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const location = useLocation();

  if (!user) {
    // Rediriger vers la page de connexion tout en sauvegardant la page d'origine
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
