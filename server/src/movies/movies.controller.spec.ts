import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { ConfigService } from '@nestjs/config';
import { MovieQueryDto } from './dto/movie-query.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { plainToInstance } from 'class-transformer';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            getMovies: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'TMDB_API_URL':
                  return 'https://api.themoviedb.org/3';
                case 'TMDB_API_KEY':
                  return 'test-api-key';
                default:
                  return null;
              }
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMovies', () => {
    it('should return MovieResponseDto', async () => {
      const query: MovieQueryDto = { page: 1 };
      const mockResponse = {
        results: [
          {
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
          },
        ],
        page: 1,
        total_pages: 500,
        total_results: 10000,
      };

      jest.spyOn(service, 'getMovies').mockResolvedValue(mockResponse);

      const result = await controller.getMovies(query);
      const responseDto = plainToInstance(MovieResponseDto, result);

      expect(responseDto).toBeInstanceOf(MovieResponseDto);
      expect(service.getMovies).toHaveBeenCalledWith(query);
    });
  });
});
