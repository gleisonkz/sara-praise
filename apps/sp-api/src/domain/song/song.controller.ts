import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';
import { AvailableSongResponse, SongListItemResponse } from '@sp/shared-interfaces';

import { SongRequestDto } from 'apps/sp-api/src/domain/song/dto/song.dto';
import { UnauthenticatedUserResponseDto } from 'apps/sp-api/src/shared';
import { SongService } from './song.service';

@ApiTags('Músicas')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('ministries/:ministryID/songs')
@ApiResponse({
  status: HttpStatus.UNAUTHORIZED,
  type: UnauthenticatedUserResponseDto,
})
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post()
  create(
    @Param('ministryID') ministryID: number,
    @Body() songRequestDto: SongRequestDto
  ): Promise<SongListItemResponse> {
    return this.songService.create(+ministryID, songRequestDto);
  }

  @Get()
  findAll(@Param('ministryID') ministryID: number): Promise<SongListItemResponse[]> {
    return this.songService.findAll(ministryID);
  }

  @Get('/available/:ministerID')
  async getAvailableSongs(
    @Param('ministryID') ministryID: number,
    @Param('ministerID') ministerID: number,
    @Query('songID') songID?: number
  ): Promise<AvailableSongResponse[]> {
    const songs = await this.songService.getAvailableSongs(ministryID, ministerID, songID);
    return songs;
  }
}
