import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';
import {
    AvailableSongResponse, eMinistryRole, MinisterSongRequest, ParticipantListItem,
    ParticipantRequest, ParticipantSelectItemResponse, ScaleListItemResponse, ScaleResponse,
    ScaleSongRequest, ScaleSongResponse
} from '@sp/shared-interfaces';

import { Prisma } from '@prisma/client';
import { MemberListItemResponseDto } from 'apps/sp-api/src/domain/member/dtos';
import { ScaleRequestDto } from 'apps/sp-api/src/domain/scale/dto/scale.dto';
import { ScaleService } from './scale.service';

@ApiTags('Escalas')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('ministries/:ministryID/scales')
export class ScaleController {
  constructor(private readonly scaleService: ScaleService) {}

  @Post()
  create(@Param('ministryID') ministryID: number, @Body() scaleRequest: ScaleRequestDto): Promise<ScaleResponse> {
    return this.scaleService.create(ministryID, scaleRequest);
  }

  @Delete(':scaleID')
  remove(@Param('scaleID') scaleID: number): Promise<boolean> {
    return this.scaleService.remove(scaleID);
  }

  @Get()
  findAll(@Param('ministryID') ministryID: number): Promise<ScaleListItemResponse[]> {
    const scales = this.scaleService.findAll(ministryID);
    return scales;
  }

  @Put(':scaleID')
  update(@Param('scaleID') scaleID: number, @Body() scaleRequest: ScaleRequestDto): Promise<ScaleResponse> {
    return this.scaleService.update(scaleID, scaleRequest);
  }

  @Get(':scaleID')
  findOne(@Param('ministryID') ministryID: number, @Param('scaleID') scaleID: number): Promise<ScaleResponse> {
    return this.scaleService.findOne(ministryID, scaleID);
  }

  @Get('/:scaleID/participants')
  findParticipants(
    @Param('ministryID') ministryID: number,
    @Param('scaleID') scaleID: number
  ): Promise<MemberListItemResponseDto[]> {
    return this.scaleService.findParticipants(ministryID, scaleID);
  }

  @Post('/:scaleID/participants')
  createParticipant(@Body() participants: ParticipantRequest[]): Promise<void> {
    return this.scaleService.upsertParticipants(participants);
  }

  @Delete(':scaleID/participants/:participantID')
  removeParticipant(@Param('participantID') participantID: number): Promise<boolean> {
    return this.scaleService.removeParticipant(participantID);
  }

  @Get('/:scaleID/participants-by-role')
  findAllParticipantsByRoleID(
    @Param('scaleID') scaleID: number,
    @Query('roleID') roleID?: eMinistryRole
  ): Promise<ParticipantSelectItemResponse[]> {
    return this.scaleService.findAllParticipantsByRoleID(scaleID, +roleID);
  }

  @Get('/:scaleID/participant-list-items')
  findParticipantListItems(@Param('scaleID') scaleID: number): Promise<ParticipantListItem[]> {
    return this.scaleService.findParticipantListItems(scaleID);
  }

  @Post('/:scaleID/songs')
  upsertSongs(@Body() scaleSongsRequest: ScaleSongRequest[]): Promise<void> {
    return this.scaleService.upsertSongs(scaleSongsRequest);
  }

  @Get('/:scaleID/songs')
  findSongs(@Param('scaleID') scaleID: number): Promise<ScaleSongResponse[]> {
    return this.scaleService.findSongs(scaleID);
  }

  @Get('/:scaleID/available-songs')
  findAvailableSongs(
    @Param('ministryID') ministryID: number,
    @Param('scaleID') scaleID: number
  ): Promise<AvailableSongResponse[]> {
    return this.scaleService.findAvailableSongs(ministryID, scaleID);
  }

  @Put('/:scaleID/songs/:songID')
  updateMinisterSong(
    @Param('songID') songID: number,
    @Param('scaleID') scaleID: number,
    @Body() ministerSongRequest: MinisterSongRequest
  ): Promise<Prisma.BatchPayload> {
    return this.scaleService.updateMinisterSong(scaleID, songID, ministerSongRequest);
  }
}
