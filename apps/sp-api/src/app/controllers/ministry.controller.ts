import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';

import {
    MemberListItemResponse, MinistryListItemResponse, MinistryRequest, ScaleListItemResponse,
    SongListItemResponse
} from '@sp/shared-interfaces';

import { KeyListItemResponse } from 'apps/sp-api/src/app/models/key.model';
import { Response } from 'express';
import { MinistryNotFoundError, MinistryService } from '../services';

@Controller('ministry')
export class MinistryController {
  constructor(private readonly ministryService: MinistryService) {}

  @Get('/list-item/:id?')
  getMinistriesListItems(@Param('id') id?: string): MinistryListItemResponse[] {
    const ministries = this.ministryService.getMinistriesListItems(id);
    return ministries;
  }

  @Get('/:id/scales')
  async getScales(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<ScaleListItemResponse[]> {
    try {
      const scales = await this.ministryService.getScales(+id);
      return scales;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }

  @Get('/:id/songs')
  async getSongs(@Param('id') id: number, @Res({ passthrough: true }) res: Response): Promise<SongListItemResponse[]> {
    try {
      const songs = await this.ministryService.getSongs(+id);
      return songs;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }

  @Get('/:id/members')
  async getMembers(
    @Param('id') id: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<MemberListItemResponse[]> {
    try {
      const members = await this.ministryService.getMembers(+id);
      return members;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }

  @Post()
  createMinistry(@Body() ministryRequest: MinistryRequest): MinistryListItemResponse {
    const ministryListItem = this.ministryService.createMinistry(ministryRequest);
    return ministryListItem;
  }

  @Get('/:id/keys')
  async getKeys(
    @Param('id') ministryID: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<KeyListItemResponse[]> {
    try {
      const keys = this.ministryService.getKeys(+ministryID);
      return keys;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }
}
