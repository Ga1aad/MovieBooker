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

@ApiTags('reservations')
@Controller('reservations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle réservation' })
  @ApiResponse({ status: 201, description: 'Réservation créée avec succès' })
  @ApiResponse({
    status: 400,
    description: 'Données invalides ou conflit horaire',
  })
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req,
  ) {
    console.log('User from request:', req.user);

    if (!req.user || !req.user.userId) {
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
  @ApiResponse({ status: 200, description: 'Liste des réservations' })
  findAll(@Request() req) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Utilisateur non authentifié');
    }
    return this.reservationService.findAllByUser(req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Annuler une réservation' })
  @ApiResponse({ status: 200, description: 'Réservation annulée avec succès' })
  @ApiResponse({ status: 404, description: 'Réservation non trouvée' })
  remove(@Param('id') id: string, @Request() req) {
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('Utilisateur non authentifié');
    }
    return this.reservationService.remove(+id, req.user.userId);
  }
}
