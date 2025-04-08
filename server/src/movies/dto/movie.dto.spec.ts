import { plainToInstance } from 'class-transformer';
import { MovieDto } from './movie.dto';

describe('MovieDto', () => {
  it('should create a valid MovieDto instance', () => {
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

    const movie = plainToInstance(MovieDto, movieData);

    expect(movie).toBeDefined();
    expect(movie.id).toBe(550);
    expect(movie.title).toBe('Galaad');
    expect(movie.poster_url).toBe(
      'https://image.tmdb.org/t/p/original/test.jpg',
    );
    expect(movie.genres).toEqual(['Action', 'SF']);
  });
});
