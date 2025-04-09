import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    example: 675,
    description: 'ID du film à réserver',
  })
  @IsNumber()
  @IsNotEmpty()
  movieId: number;

  @ApiProperty({
    example: '2025-04-10T18:00:00',
    description: 'Date et heure de la réservation (format ISO)',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;
}
