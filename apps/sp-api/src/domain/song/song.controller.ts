import { Body, Controller, Get, HttpStatus, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';
import { AvailableSongResponse } from '@sp/shared-interfaces';

import { SongRequestDto, SongResponseDto } from 'apps/sp-api/src/domain/song/dto/song.dto';
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
  create(@Param('ministryID') ministryID: number, @Body() songRequestDto: SongRequestDto): Promise<SongResponseDto> {
    return this.songService.create(+ministryID, songRequestDto);
  }

  @Get()
  findAll(@Param('ministryID') ministryID: number): Promise<SongResponseDto[]> {
    const songs = this.songService.findAll(+ministryID);
    return songs as any;
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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.songService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
  //   return this.songService.update(+id, updateSongDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.songService.remove(+id);
  // }
}
