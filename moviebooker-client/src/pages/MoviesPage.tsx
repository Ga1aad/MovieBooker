import { MovieGrid } from "@/components/movies/MovieGrid";

export function MoviesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Films à l'affiche</h1>
      <MovieGrid />
    </div>
  );
}
