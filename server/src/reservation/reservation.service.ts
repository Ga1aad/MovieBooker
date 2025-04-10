import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { MoviesService } from '../movies/movies.service';
import { User } from '../user/entities/user.entity';

interface UserInfo {
  id: number;
  email: string;
}

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    private moviesService: MoviesService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
    user: any,
  ): Promise<Reservation> {
    const startTime = new Date(createReservationDto.startTime);

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);

    const now = new Date();

    if (startTime <= now) {
      throw new BadRequestException(
        'La date de réservation doit être dans le futur',
      );
    }

    // Vérifier les conflits de réservation pour l'utilisateur
    const userReservations = await this.reservationRepository.find({
      where: { userId: user.id },
      order: { startTime: 'ASC' },
    });

    // Vérifier qu'il y a au moins 1h59 entre les débuts de séances
    for (const existingReservation of userReservations) {
      const existingStart = new Date(existingReservation.startTime);

      const minutesBetweenStarts = Math.abs(
        (startTime.getTime() - existingStart.getTime()) / (1000 * 60),
      );

      if (minutesBetweenStarts < 119) {
        throw new BadRequestException(
          'Il doit y avoir au moins 1h59 entre les débuts de chaque séance',
        );
      }
    }

    // Vérifier les conflits directs
    const conflicts = await this.reservationRepository.find({
      where: {
        userId: user.id,
        startTime: Between(startTime, endTime),
      },
    });

    if (conflicts.length > 0) {
      throw new BadRequestException(
        'Vous avez déjà une réservation sur ce créneau horaire',
      );
    }

    const movie = await this.moviesService.getMovieById(
      createReservationDto.movieId,
    );

    if (!movie) {
      throw new NotFoundException('Film non trouvé');
    }

    const reservation = this.reservationRepository.create({
      movieId: createReservationDto.movieId,
      movieTitle: movie.title,
      startTime: startTime,
      endTime: endTime,
      userId: user.id,
    });

    return this.reservationRepository.save(reservation);
  }

  async findAllByUser(userId: number): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.find({
      where: { userId },
      order: { startTime: 'ASC' },
    });

    return reservations;
  }

  async remove(id: number, userId: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id, userId },
    });

    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    const now = new Date();

    if (new Date(reservation.startTime) <= now) {
      throw new BadRequestException(
        "Impossible d'annuler une réservation déjà commencée",
      );
    }

    await this.reservationRepository.remove(reservation);
  }
}
