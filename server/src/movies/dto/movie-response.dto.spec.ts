import { plainToInstance } from 'class-transformer';
import { MovieResponseDto } from './movie-response.dto';
import { MovieDto } from './movie.dto';

describe('MovieResponseDto', () => {
  it('should create a valid MovieResponseDto instance', () => {
    const movieData = {
      id: 550,
      title: 'Galaad',
      overview: "Un eleve de l'EFREI",
      release_date: '2025-04-08',
      poster_path: '/test.jpg',
      vote_average: 8.4,
      vote_count: 24751,
      original_language: 'fr',
      genres: ['Action', 'SF'],
      poster_url: 'https://image.tmdb.org/t/p/original/test.jpg',
    };

    const movieDto = plainToInstance(MovieDto, movieData);

    const responseData = {
      results: [movieDto],
      page: 1,
      total_pages: 500,
      total_results: 10000,
    };

    const response = plainToInstance(MovieResponseDto, responseData);

    expect(response).toBeInstanceOf(MovieResponseDto);
    expect(response.page).toBe(1);
    expect(response.total_pages).toBe(500);
    expect(response.total_results).toBe(10000);
    expect(response.results).toHaveLength(1);
    expect(response.results[0].title).toBe('Galaad');

    response.results.forEach((movie) => {
      expect(movie).toBeInstanceOf(MovieDto);
    });

    const movie = response.results[0];
    expect(movie.id).toBe(550);
    expect(movie.title).toBe('Galaad');
    expect(movie.overview).toBe("Un eleve de l'EFREI");
    expect(movie.poster_url).toBe(
      'https://image.tmdb.org/t/p/original/test.jpg',
    );
    expect(movie.vote_average).toBe(8.4);
    expect(movie.genres).toEqual(['Action', 'SF']);
  });
});
