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
    // Conversion explicite en UTC+2 (fuseau horaire de Paris)
    const startTime = new Date(createReservationDto.startTime);
    startTime.setHours(startTime.getHours() + 2);

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 2);

    const now = new Date();
    now.setHours(now.getHours() + 2);

    if (startTime <= now) {
      throw new BadRequestException(
        'La date de réservation doit être dans le futur',
      );
    }

    // Vérifier les conflits de réservation
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

    // Création de la réservation avec les heures ajustées
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

    // Ajuster les heures pour l'affichage
    return reservations.map((reservation) => ({
      ...reservation,
      startTime: new Date(reservation.startTime),
      endTime: new Date(reservation.endTime),
    }));
  }

  async remove(id: number, userId: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id, userId },
    });

    if (!reservation) {
      throw new NotFoundException('Réservation non trouvée');
    }

    const now = new Date();
    now.setHours(now.getHours() + 2);

    if (reservation.startTime <= now) {
      throw new BadRequestException(
        "Impossible d'annuler une réservation déjà commencée",
      );
    }

    await this.reservationRepository.remove(reservation);
  }
}
