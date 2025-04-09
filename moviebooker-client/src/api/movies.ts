import { api } from "./auth";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_url: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genres: string[];
}

interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

interface GetMoviesParams {
  page?: number;
  search?: string;
  sort?: "popularity" | "release_date" | "vote_average";
}

export const moviesApi = {
  getMovies: async (params: GetMoviesParams = {}): Promise<MovieResponse> => {
    const response = await api.get<MovieResponse>("/movies", {
      params: {
        page: params.page || 1,
        search: params.search,
        sort: params.sort || "popularity",
      },
    });
    return response.data;
  },
};
