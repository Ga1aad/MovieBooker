import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function ProfilePage() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (username: string) => {
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarFallback className="text-2xl">
              {getInitials(user?.username || user?.email || "")}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">Profil Utilisateur</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-500">
              Nom d'utilisateur
            </h3>
            <p className="text-lg">{user?.username || "Non défini"}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-500">Email</h3>
            <p className="text-lg">{user?.email}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-sm text-gray-500">Membre depuis</h3>
            <p className="text-lg">{new Date().toLocaleDateString()}</p>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="w-full"
          >
            Se déconnecter
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
