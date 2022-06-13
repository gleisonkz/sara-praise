import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';
import { ParticipantRequest, ScaleListItemResponse, ScaleResponse } from '@sp/shared-interfaces';

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
    return this.scaleService.create(+ministryID, scaleRequest);
  }

  @Put(':scaleID')
  update(@Param('scaleID') scaleID: number, @Body() scaleRequest: ScaleRequestDto): Promise<ScaleResponse> {
    return this.scaleService.update(+scaleID, scaleRequest);
  }

  @Get()
  findAll(@Param('ministryID') ministryID: number): Promise<ScaleListItemResponse[]> {
    const scales = this.scaleService.findAll(+ministryID);
    return scales;
  }

  @Get(':scaleID')
  findOne(@Param('ministryID') ministryID: number, @Param('scaleID') scaleID: number): Promise<ScaleResponse> {
    return this.scaleService.findOne(+ministryID, +scaleID);
  }

  @Get('/:scaleID/participants')
  findParticipants(@Param('ministryID') ministryID: number, @Param('scaleID') scaleID: number): any {
    return this.scaleService.findParticipants(+ministryID, +scaleID);
  }

  @Get('/:scaleID/participant-list-items')
  findParticipantListItems(@Param('ministryID') ministryID: number, @Param('scaleID') scaleID: number): any {
    return this.scaleService.findParticipantListItems(+ministryID, +scaleID);
  }

  @Post('/:scaleID/participants')
  createParticipant(@Body() participants: ParticipantRequest[]): any {
    return this.scaleService.createParticipant(participants);
  }
}
