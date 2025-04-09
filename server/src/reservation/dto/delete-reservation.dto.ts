import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteReservationDto {
  @ApiProperty({
    example: 1,
    description: 'ID de la réservation à supprimer',
  })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
