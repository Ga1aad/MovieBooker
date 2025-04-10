import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import axios from 'axios';
import { MovieQueryDto } from './dto/movie-query.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { MovieDto } from './dto/movie.dto';

@Injectable()
export class MoviesService {
  private readonly apiUrl: string;
  private readonly apiKey: string;
  private readonly imageBaseUrl: string = 'https://image.tmdb.org/t/p/original';

  constructor(private configService: ConfigService) {
    const apiUrl = this.configService.get<string>('TMDB_API_URL');
    const apiKey = this.configService.get<string>('TMDB_API_KEY');

    if (!apiUrl || !apiKey) {
      throw new Error('TMDB configuration missing');
    }

    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async getMovies(query: MovieQueryDto): Promise<MovieResponseDto> {
    try {
      let endpoint = `${this.apiUrl}/discover/movie`;

      if (query.search) {
        endpoint = `${this.apiUrl}/search/movie`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          page: query.page,
          query: query.search,
          sort_by: query.sort ? `${query.sort}.desc` : 'popularity.desc',
        },
      });

      const movies = response.data.results.map((movie) => ({
        ...movie,
        poster_url: movie.poster_path
          ? `${this.imageBaseUrl}${movie.poster_path}`
          : null,
        genres: movie.genre_ids,
      })) as MovieDto[];

      const movieResponse = {
        results: movies,
        page: response.data.page,
        total_pages: response.data.total_pages,
        total_results: response.data.total_results,
      };

      return plainToInstance(MovieResponseDto, movieResponse);
    } catch (error) {
      throw new HttpException(
        'Erreur lors de la récupération des films',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getMovieById(id: number): Promise<MovieDto | null> {
    try {
      const response = await axios.get(`${this.apiUrl}/movie/${id}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      const movie = response.data;
      return {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: movie.poster_path || null,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        original_language: movie.original_language,
        genres: movie.genres.map((g) => g.name),
        poster_url: movie.poster_path
          ? `${this.imageBaseUrl}${movie.poster_path}`
          : null,
      } as MovieDto;
    } catch (error) {
      return null;
    }
  }
}
