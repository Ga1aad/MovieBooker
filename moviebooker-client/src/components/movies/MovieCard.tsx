import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Movie } from "@/api/movies";
import { MovieModal } from "./MovieModal";

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card
        className="overflow-hidden h-full flex flex-col cursor-pointer transition-transform hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="object-cover w-full h-full"
          />
        </div>
        <CardHeader className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{movie.title}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-sm text-gray-600 line-clamp-3">{movie.overview}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-sm text-gray-500">
            {new Date(movie.release_date).toLocaleDateString()}
          </p>
        </CardFooter>
      </Card>

      <MovieModal
        movie={movie}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
