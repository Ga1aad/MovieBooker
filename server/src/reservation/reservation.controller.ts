import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { DeleteReservationDto } from './dto/delete-reservation.dto';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { ReservationListResponseDto } from './dto/reservation-list-response.dto';

@ApiTags('reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle réservation' })
  @ApiResponse({ status: 201, type: ReservationResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou conflit horaire',
  })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req,
  ): Promise<ReservationResponseDto> {
    if (!req.user) {
      throw new BadRequestException('Utilisateur non authentifié');
    }

    const user = {
      id: req.user.userId,
      email: req.user.email,
    };

    return this.reservationService.create(createReservationDto, user);
  }

  @Get()
  @ApiOperation({
    summary: "Récupérer toutes les réservations de l'utilisateur",
  })
  @ApiResponse({ status: 200, type: ReservationListResponseDto })
  async findAll(@Request() req): Promise<ReservationListResponseDto> {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Utilisateur non authentifié');
    }
    const reservations = await this.reservationService.findAllByUser(
      req.user.userId,
    );
    return {
      reservations,
      total: reservations.length,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation annulée avec succès' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<void> {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Utilisateur non authentifié');
    }
    return this.reservationService.remove(id, req.user.userId);
  }
}
