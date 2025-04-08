import { ApiProperty } from '@nestjs/swagger';

export class MovieDto {
  @ApiProperty({
    example: 550,
    description: 'Identifiant unique du film',
  })
  id: number;

  @ApiProperty({
    example: 'Galaad',
    description: 'Titre du film',
  })
  title: string;

  @ApiProperty({
    example: "Un eleve de l'EFREI",
    description: 'Synopsis du film',
  })
  overview: string;

  @ApiProperty({
    example: '2025-04-08',
    description: 'Date de sortie du film',
  })
  release_date: string;

  @ApiProperty({
    example: '/test.jpg',
    description: "Chemin de l'affiche du film",
  })
  poster_path: string;

  @ApiProperty({
    example: 8.4,
    description: 'Note moyenne du film',
    minimum: 0,
    maximum: 10,
  })
  vote_average: number;

  @ApiProperty({
    example: 24751,
    description: 'Nombre de votes',
  })
  vote_count: number;

  @ApiProperty({
    example: 'fr',
    description: 'Langue originale du film',
  })
  original_language: string;

  @ApiProperty({
    example: ['Action', 'SF'],
    description: 'Genres du film',
    isArray: true,
  })
  genres: string[];

  @ApiProperty({
    example: 'https://image.tmdb.org/t/p/original/test.jpg',
    description: "URL complète de l'affiche",
  })
  poster_url: string;
}
