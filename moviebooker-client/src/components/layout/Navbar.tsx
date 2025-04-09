import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function Navbar() {
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
          <Link to="/profile">
            <Button variant="ghost">Profil</Button>
          </Link>
          <Link to="/login">
            <Button variant="default">Connexion</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
