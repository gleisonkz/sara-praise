import {
    Body, Controller, Get, HttpStatus, Param, Post, Put, Query, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';
import {
    AvailableSongResponse, Pagination, SongListItemResponse, SongResponse
} from '@sp/shared-interfaces';

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
    console.log('songRequestDto', songRequestDto);
    return this.songService.create(+ministryID, songRequestDto);
  }

  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'pageNumber', required: false })
  @Get()
  findAll(
    @Param('ministryID') ministryID: number,
    @Query('pageSize') pageSize: number,
    @Query('pageNumber') pageNumber: number
  ): Promise<Pagination<SongListItemResponse>> {
    return this.songService.findAll(ministryID, pageSize, pageNumber);
  }

  @Get(':songID')
  findByID(@Param('ministryID') ministryID: number, @Param('songID') songID: number): Promise<SongResponse> {
    return this.songService.findOne(ministryID, songID);
  }

  @Put(':songID')
  update(
    @Param('ministryID') ministryID: number,
    @Param('songID') songID: number,
    @Body() songRequestDto: SongRequestDto
  ): Promise<SongListItemResponse> {
    return this.songService.update(ministryID, songID, songRequestDto);
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
