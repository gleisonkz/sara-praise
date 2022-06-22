import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';
import { ArtistRequest } from '@sp/shared-interfaces';

import { Artist } from '@prisma/client';
import { ArtistRequestDto, ArtistResponseDto } from 'apps/sp-api/src/domain/artist/dto/artist.dto';

@Injectable()
export class ArtistService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(ministryID: number, artistRequest: ArtistRequestDto): Promise<ArtistResponseDto> {
    const artist = await this.prismaService.artist.create({
      data: {
        name: artistRequest.name,
        ministryID,
      },
    });

    const artistResponse: ArtistResponseDto = {
      artistID: artist.artistID,
      name: artist.name,
    };

    return artistResponse;
  }

  async update(id: number, updateArtistDto: ArtistRequest): Promise<Artist> {
    return this.prismaService.artist.update({
      where: {
        artistID: id,
      },
      data: {
        name: updateArtistDto.name,
      },
    });
  }

  async findAll(ministryID: number): Promise<ArtistResponseDto[]> {
    const artistEntities = await this.prismaService.artist.findMany({
      where: {
        ministryID,
      },
      orderBy: {
        artistID: 'asc',
      },
    });

    const artists: ArtistResponseDto[] = artistEntities.map((artist) => {
      const artistResponse: ArtistResponseDto = {
        artistID: artist.artistID,
        name: artist.name,
      };

      return artistResponse;
    });

    return artists;
  }

  findByID(artistID: number): any {
    return this.prismaService.artist.findFirst({
      where: {
        artistID,
      },
    });
  }

  async remove(artistID: number): Promise<Artist> {
    return this.prismaService.artist.delete({
      where: {
        artistID,
      },
    });
  }
}
