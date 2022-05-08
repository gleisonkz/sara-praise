import { Injectable } from '@nestjs/common';

import { PrismaService } from '@sp/api/domain/prisma';

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

  async findAll(ministryID: number): Promise<ArtistResponseDto[]> {
    const artistEntities = await this.prismaService.artist.findMany({
      where: {
        ministryID,
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

  // findOne(id: number) {
  //   return `This action returns a #${id} artist`;
  // }

  // update(id: number, updateArtistDto: UpdateArtistDto) {
  //   return `This action updates a #${id} artist`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} artist`;
  // }
}
