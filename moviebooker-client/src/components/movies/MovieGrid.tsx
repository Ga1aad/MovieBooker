import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { moviesApi, Movie, MovieResponse } from "@/api/movies";
import { MovieCard } from "./MovieCard";
import { MovieFilters } from "./MovieFilters";
import { MoviePagination } from "./MoviePagination";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function MovieGrid() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<
    "popularity" | "release_date" | "vote_average"
  >("popularity");

  const { data, isLoading, error } = useQuery<MovieResponse, Error>({
    queryKey: ["movies", page, search, sort],
    queryFn: () => moviesApi.getMovies({ page, search, sort }),
  });

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">
          Une erreur est survenue lors du chargement des films.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <MovieFilters
        onSearchChange={handleSearch}
        onSortChange={(
          value: "popularity" | "release_date" | "vote_average"
        ) => {
          setSort(value);
          setPage(1);
        }}
        currentSort={sort}
        currentSearch={search}
      />

      <div className="space-y-6">
        {data && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">
                {search ? `Résultats pour "${search}"` : "Films disponibles"}
              </h2>
              <span className="text-sm text-gray-500">
                ({data.total_results} films)
              </span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="text-sm text-gray-500">Chargement des films...</p>
            </div>
          </div>
        ) : data?.results.length === 0 ? (
          <div className="inline-block text-center py-8 px-12 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500 mb-2">Aucun film trouvé</p>
            {search && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSearch("")}
              >
                Réinitialiser la recherche
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {data?.results.map((movie: Movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>

      {data && data.total_pages > 1 && (
        <div className="flex justify-center mt-8">
          <MoviePagination
            currentPage={page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
