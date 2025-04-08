import { ApiProperty } from '@nestjs/swagger';
import { MovieDto } from './movie.dto';

export class MovieResponseDto {
  @ApiProperty({
    description: 'Liste des films',
    type: [MovieDto],
  })
  results: MovieDto[];

  @ApiProperty({
    example: 1,
    description: 'Page actuelle',
  })
  page: number;

  @ApiProperty({
    example: 500,
    description: 'Nombre total de pages',
  })
  total_pages: number;

  @ApiProperty({
    example: 10000,
    description: 'Nombre total de résultats',
  })
  total_results: number;
}
