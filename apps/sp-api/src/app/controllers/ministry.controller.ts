import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';

import {
    KeyResponse, MemberListItemResponse, MinistryKeyListItemResponse, MinistryKeyRequest,
    MinistryListItemResponse, MinistryRequest, ScaleListItemResponse, ScaleRequest,
    ScaleResponseCreate, SongListItemResponse
} from '@sp/shared-interfaces';

import { Response } from 'express';
import { MinistryNotFoundError, MinistryService } from '../services';

@Controller('ministry')
export class MinistryController {
  constructor(private readonly ministryService: MinistryService) {}

  @Get('/list-item/:ministryID?')
  getMinistriesListItems(@Param('ministryID') ministryID?: string): MinistryListItemResponse[] {
    const ministries = this.ministryService.getMinistriesListItems(ministryID);
    return ministries;
  }

  @Get('/:ministryID/scale-list-items')
  async getScales(
    @Param('ministryID') ministryID: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<ScaleListItemResponse[]> {
    try {
      const scales = await this.ministryService.getScales(+ministryID);
      return scales;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }

  @Get('/:ministryID/songs')
  async getSongs(
    @Param('ministryID') ministryID: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<SongListItemResponse[]> {
    try {
      const songs = await this.ministryService.getSongs(+ministryID);
      return songs;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }

  @Get('/:ministryID/songs/available/:ministerID')
  async getAvailableSongs(
    @Param('ministryID') ministryID: number,
    @Param('ministerID') ministerID: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<SongListItemResponse[]> {
    try {
      const songs = await this.ministryService.getAvailableSongs(+ministryID, +ministerID);
      return songs;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }

  @Get('/:ministryID/members')
  async getMembers(
    @Param('ministryID') ministryID: number,
    @Query('roles') roles,
    @Res({ passthrough: true }) res: Response
  ): Promise<MemberListItemResponse[]> {
    try {
      const members = await this.ministryService.getMembers(+ministryID, roles);
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

  @Post('/:ministryID/keys')
  createMinistryKey(
    @Body() ministryKeyRequest: MinistryKeyRequest,
    @Param('ministryID') ministryID: number
  ): MinistryKeyListItemResponse {
    const ministryKey = this.ministryService.createMinistryKey(ministryKeyRequest, +ministryID);
    return ministryKey;
  }

  @Post('/:ministryID/scale')
  async createScale(
    @Param('ministryID') ministryID: number,
    @Body() scaleRequest: ScaleRequest,
    @Res({ passthrough: true }) res: Response
  ): Promise<ScaleResponseCreate> {
    const scaleID = await this.ministryService.createScale(+ministryID, scaleRequest);

    return { scaleID };
  }

  @Get('/scales/:scaleID')
  async getScaleByID(@Param('scaleID') scaleID: number, @Res({ passthrough: true }) res: Response) {
    try {
      const scale = await this.ministryService.getScaleByIDAsync(+scaleID);
      return scale;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }

  @Get('/:ministryID/keys')
  async getKeyListItems(
    @Param('ministryID') ministryID: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<MinistryKeyListItemResponse[]> {
    try {
      const keys = this.ministryService.getKeyListItems(+ministryID);
      return keys;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }

  @Get('keys')
  async getKeys(@Res({ passthrough: true }) res: Response): Promise<KeyResponse[]> {
    try {
      const keys = this.ministryService.getKeys();
      return keys;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }

  @Get('/scale-details/:scaleID')
  async getScaleDetails(@Param('scaleID') scaleID: number, @Res({ passthrough: true }) res: Response) {
    try {
      const scaleDetails = this.ministryService.getScaleDetails(+scaleID);
      return scaleDetails;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        return res.status(HttpStatus.BAD_REQUEST).send(error.message);
      }

      throw error;
    }
  }
}
