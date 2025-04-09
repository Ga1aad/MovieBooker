import { ApiProperty } from '@nestjs/swagger';
import { ReservationResponseDto } from './reservation-response.dto';

export class ReservationListResponseDto {
  @ApiProperty({
    type: [ReservationResponseDto],
    description: 'Liste des réservations',
  })
  reservations: ReservationResponseDto[];

  @ApiProperty({
    example: 5,
    description: 'Nombre total de réservations',
  })
  total: number;
}
