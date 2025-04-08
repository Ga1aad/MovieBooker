import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MoviesService } from './movies.service';
import { MovieQueryDto } from './dto/movie-query.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { HttpException } from '@nestjs/common';
import axios from 'axios';
import { plainToInstance } from 'class-transformer';

jest.mock('axios');

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
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

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw error if TMDB configuration is missing', () => {
      const invalidConfigService = new ConfigService({});

      expect(() => {
        new MoviesService(invalidConfigService);
      }).toThrow('TMDB configuration missing');
    });

    it('should create service successfully with valid configuration', () => {
      const validConfigService = new ConfigService({
        TMDB_API_URL: 'https://api.themoviedb.org/3',
        TMDB_API_KEY: 'test-api-key',
      });

      expect(() => {
        new MoviesService(validConfigService);
      }).not.toThrow();
    });
  });

  describe('getMovies', () => {
    it('should transform API response to MovieResponseDto', async () => {
      const query: MovieQueryDto = {
        page: 1,
      };

      const mockApiResponse = {
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
          },
        ],
        page: 1,
        total_pages: 500,
        total_results: 10000,
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockApiResponse });

      const result = await service.getMovies(query);
      const responseDto = plainToInstance(MovieResponseDto, result);

      expect(responseDto).toBeInstanceOf(MovieResponseDto);
      expect(responseDto.results[0].poster_url).toBe(
        'https://image.tmdb.org/t/p/original/test.jpg',
      );
      expect(responseDto.results[0].title).toBe('Galaad');
      expect(responseDto.page).toBe(1);
      expect(responseDto.total_pages).toBe(500);
    });

    it('should handle missing poster_path', async () => {
      const query: MovieQueryDto = {
        page: 1,
      };

      const mockApiResponse = {
        results: [
          {
            id: 550,
            title: 'Galaad',
            poster_path: null,
          },
        ],
        page: 1,
        total_pages: 1,
        total_results: 1,
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockApiResponse });

      const result = await service.getMovies(query);
      const responseDto = plainToInstance(MovieResponseDto, result);

      expect(responseDto.results[0].poster_url).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      const query: MovieQueryDto = {
        page: 1,
        search: 'invalid-search',
      };

      (axios.get as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

      await expect(service.getMovies(query)).rejects.toThrow(HttpException);
    });

    it('should use search endpoint when search query is provided', async () => {
      const query: MovieQueryDto = {
        page: 1,
        search: 'test movie',
      };

      const mockApiResponse = {
        results: [],
        page: 1,
        total_pages: 0,
        total_results: 0,
      };

      const axiosGet = axios.get as jest.Mock;
      axiosGet.mockResolvedValueOnce({ data: mockApiResponse });

      await service.getMovies(query);

      expect(axiosGet).toHaveBeenCalledWith(
        expect.stringContaining('/search/movie'),
        expect.any(Object),
      );
    });

    it('should use discover endpoint when no search query is provided', async () => {
      const query: MovieQueryDto = {
        page: 1,
      };

      const mockApiResponse = {
        results: [],
        page: 1,
        total_pages: 0,
        total_results: 0,
      };

      const axiosGet = axios.get as jest.Mock;
      axiosGet.mockResolvedValueOnce({ data: mockApiResponse });

      await service.getMovies(query);

      expect(axiosGet).toHaveBeenCalledWith(
        expect.stringContaining('/discover/movie'),
        expect.any(Object),
      );
    });
  });
});
