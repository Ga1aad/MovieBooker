import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthContext();
  const navigate = useNavigate();

  const getDisplayName = (
    user: { email: string; username?: string } | null
  ) => {
    if (!user) return "";
    // Prioriser le username, ne PAS utiliser l'email coupé si un username existe
    return user.username || user.email; // Retourner l'email complet si pas de username
  };

  // Logs de débogage
  // console.log("Auth state:", {
  //   isAuthenticated,
  //   user,
  //   cookies: {
  //     token: Cookies.get("token"),
  //     user: Cookies.get("user"),
  //   },
  // });

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <Link to="/" className="font-bold text-xl">
          MovieBooker
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <Link to="/movies">
            <Button variant="ghost">Films</Button>
          </Link>

          {isAuthenticated ? (
            <>
              <Button
                variant="outline"
                className="bg-blue-100 hover:bg-blue-200 text-blue-800"
                onClick={() => navigate("/profile")}
              >
                {getDisplayName(user)}
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="default">Connexion</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
