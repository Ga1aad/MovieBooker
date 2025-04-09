import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { MoviesService } from '../movies/movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ReservationService', () => {
  let service: ReservationService;
  let moviesService: MoviesService;
  let reservationRepository: Repository<Reservation>;

  // Mock pour MoviesService
  const mockMoviesService = {
    getMovieById: jest.fn(),
  };

  // Mock pour Repository
  const mockReservationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: MoviesService,
          useValue: mockMoviesService,
        },
        {
          provide: getRepositoryToken(Reservation),
          useValue: mockReservationRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    moviesService = module.get<MoviesService>(MoviesService);
    reservationRepository = module.get<Repository<Reservation>>(
      getRepositoryToken(Reservation),
    );

    // Reset des mocks avant chaque test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation successfully', async () => {
      const createReservationDto = {
        movieId: 675,
        startTime: '2025-04-10T18:00:00',
      };

      const user = {
        id: 1,
        email: 'user1@example.com',
      };

      const movie = {
        id: 675,
        title: 'Harry Potter and the Order of the Phoenix',
        overview: 'Test overview',
        release_date: '2025-04-10',
        poster_path: '/test.jpg',
        vote_average: 8.5,
        vote_count: 1000,
        original_language: 'en',
        genres: ['Fantasy'],
        poster_url: 'https://test.com/test.jpg',
      };

      const mockReservation = {
        id: 1,
        movieId: 675,
        movieTitle: movie.title,
        startTime: new Date('2025-04-10T18:00:00'),
        endTime: new Date('2025-04-10T20:00:00'),
        userId: 1,
      };

      mockMoviesService.getMovieById.mockResolvedValue(movie);
      mockReservationRepository.find.mockResolvedValue([]);
      mockReservationRepository.create.mockReturnValue(mockReservation);
      mockReservationRepository.save.mockResolvedValue(mockReservation);

      const result = await service.create(createReservationDto, user);

      expect(result.movieId).toBe(675);
      expect(result.movieTitle).toBe(movie.title);
      expect(mockMoviesService.getMovieById).toHaveBeenCalledWith(675);
      expect(mockReservationRepository.create).toHaveBeenCalled();
      expect(mockReservationRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException for past date', async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      const createReservationDto = {
        movieId: 675,
        startTime: pastDate.toISOString(),
      };

      const user = {
        id: 1,
        email: 'user1@example.com',
      };

      await expect(service.create(createReservationDto, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for conflicting reservation', async () => {
      const createReservationDto = {
        movieId: 675,
        startTime: '2025-04-10T18:00:00',
      };

      const user = {
        id: 1,
        email: 'user1@example.com',
      };

      mockReservationRepository.find.mockResolvedValue([
        {
          id: 1,
          movieId: 676,
          startTime: new Date('2025-04-10T17:00:00'),
          endTime: new Date('2025-04-10T19:00:00'),
        },
      ]);

      await expect(service.create(createReservationDto, user)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllByUser', () => {
    it('should return all reservations for a user', async () => {
      const userId = 1;
      const mockReservations = [
        {
          id: 1,
          movieId: 675,
          movieTitle: 'Test Movie',
          startTime: new Date(),
          endTime: new Date(),
          userId,
        },
      ];

      mockReservationRepository.find.mockResolvedValue(mockReservations);

      const result = await service.findAllByUser(userId);

      expect(result).toEqual(mockReservations);
      expect(mockReservationRepository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { startTime: 'ASC' },
      });
    });
  });

  describe('remove', () => {
    it('should remove a reservation', async () => {
      const reservationId = 1;
      const userId = 1;
      const mockReservation = {
        id: reservationId,
        startTime: new Date('2025-04-10T18:00:00'),
        userId,
      };

      mockReservationRepository.findOne.mockResolvedValue(mockReservation);

      await service.remove(reservationId, userId);

      expect(mockReservationRepository.remove).toHaveBeenCalledWith(
        mockReservation,
      );
    });

    it('should throw NotFoundException when reservation not found', async () => {
      mockReservationRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1, 1)).rejects.toThrow(NotFoundException);
    });
  });
});
