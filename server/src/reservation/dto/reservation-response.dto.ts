import { ApiProperty } from '@nestjs/swagger';

export class ReservationResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la réservation',
  })
  id: number;

  @ApiProperty({
    example: 675,
    description: 'ID du film',
  })
  movieId: number;

  @ApiProperty({
    example: 'Harry Potter and the Order of the Phoenix',
    description: 'Titre du film',
  })
  movieTitle: string;

  @ApiProperty({
    example: '2025-04-10T18:00:00',
    description: 'Heure de début de la réservation',
  })
  startTime: Date;

  @ApiProperty({
    example: '2025-04-10T20:00:00',
    description: 'Heure de fin de la réservation',
  })
  endTime: Date;

  @ApiProperty({
    example: 1,
    description: "ID de l'utilisateur",
  })
  userId: number;
}
