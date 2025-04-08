import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MovieQueryDto } from './dto/movie-query.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer la liste des films' })
  @ApiOkResponse({
    description: 'Liste des films récupérée avec succès',
    type: MovieResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erreur lors de la récupération des films',
  })
  async getMovies(@Query() query: MovieQueryDto): Promise<MovieResponseDto> {
    return this.moviesService.getMovies(query);
  }
}
