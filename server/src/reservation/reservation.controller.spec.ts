import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { BadRequestException } from '@nestjs/common';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockReservationService = {
    create: jest.fn(),
    findAllByUser: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: mockReservationService,
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);

    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation successfully', async () => {
      // Préparation des données de test
      const createReservationDto: CreateReservationDto = {
        movieId: 675,
        startTime: '2025-04-10T18:00:00',
      };

      // Modification de la structure du mock pour correspondre à la structure JWT
      const mockRequest = {
        user: {
          userId: 1, // Utilisation de userId au lieu de id
          email: 'user1@example.com',
        },
      };

      const expectedResponse: ReservationResponseDto = {
        id: 1,
        movieId: 675,
        movieTitle: 'Harry Potter and the Order of the Phoenix',
        startTime: new Date('2025-04-10T18:00:00'),
        endTime: new Date('2025-04-10T20:00:00'),
        userId: 1,
      };

      mockReservationService.create.mockResolvedValue(expectedResponse);

      // Exécution du test avec la nouvelle structure
      const result = await controller.create(createReservationDto, mockRequest);

      // Vérifications
      expect(result).toEqual(expectedResponse);
      expect(mockReservationService.create).toHaveBeenCalledWith(
        createReservationDto,
        { id: mockRequest.user.userId, email: mockRequest.user.email }, // Transformation de la structure
      );
    });

    it('should throw BadRequestException when user is not authenticated', async () => {
      const createReservationDto: CreateReservationDto = {
        movieId: 675,
        startTime: '2025-04-10T18:00:00',
      };

      await expect(
        controller.create(createReservationDto, { user: null }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
