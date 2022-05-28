import { Body, Controller, Get, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';

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
    console.log({ ministryID, songRequestDto });
    return this.songService.create(+ministryID, songRequestDto);
  }

  @Get()
  findAll(@Param('ministryID') ministryID: number): Promise<SongResponseDto[]> {
    console.log({ ministryID });
    const songs = this.songService.findAll(+ministryID);
    return songs as any;
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
