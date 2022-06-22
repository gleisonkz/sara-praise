/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
    Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';
import { ArtistRequest } from '@sp/shared-interfaces';

import { ArtistRequestDto, ArtistResponseDto } from 'apps/sp-api/src/domain/artist/dto/artist.dto';
import { UnauthenticatedUserResponseDto } from 'apps/sp-api/src/shared';
import { ArtistService } from './artist.service';

@ApiTags('Artistas')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('ministries/:ministryID/artists')
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  type: UnauthenticatedUserResponseDto,
})
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  create(@Param('ministryID') ministryID: number, @Body() artistRequest: ArtistRequestDto): Promise<ArtistResponseDto> {
    return this.artistService.create(ministryID, artistRequest);
  }

  @Get()
  findAll(@Param('ministryID') ministryID: number) {
    return this.artistService.findAll(ministryID);
  }

  @Get('/:artistID')
  findByID(@Param('artistID') artistID: number) {
    return this.artistService.findByID(artistID);
  }

  @Put(':artistID')
  update(@Param('artistID') id: number, @Body() updateArtistDto: ArtistRequest) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':artistID')
  remove(@Param('artistID') id: number) {
    return this.artistService.remove(id);
  }
}
