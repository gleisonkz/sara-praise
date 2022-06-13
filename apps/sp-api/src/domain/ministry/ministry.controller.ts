import {
    Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';
import { IMinisterSongKeyRequest, MinistryListItemResponse } from '@sp/shared-interfaces';

import { Response } from 'express';
import { MinisterSongKeyListItemResponse, MinistryRequestDto } from './dtos';
import { MinistryNotFoundError } from './ministry.error';
import { MinistryService } from './ministry.service';

@ApiTags('Ministérios')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('ministries')
export class MinistryController {
  constructor(private readonly ministryService: MinistryService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: MinistryListItemResponse,
  })
  async createMinistry(@Body() ministryRequest: MinistryRequestDto): Promise<MinistryListItemResponse> {
    const ministryListItem = this.ministryService.createMinistry(ministryRequest);
    return ministryListItem;
  }

  @ApiQuery({ name: 'ministryID', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MinistryListItemResponse,
  })
  @Get('/list-item/:ministryID?')
  async getMinistriesListItems(@Param('ministryID') ministryID?: string): Promise<MinistryListItemResponse[]> {
    const parsedID = ministryID ? +ministryID : undefined;
    const ministries = await this.ministryService.getMinistriesListItems(parsedID);

    return ministries;
  }

  @ApiQuery({ name: 'ministryID', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MinisterSongKeyListItemResponse,
  })
  @Get('/:ministryID/minister-song-key')
  async getMinisterSongKeysListItem(
    @Param('ministryID') ministryID?: string
  ): Promise<MinisterSongKeyListItemResponse[]> {
    const ministerSongKeys = await this.ministryService.getMinisterSongKeysListItem(+ministryID);

    return ministerSongKeys;
  }

  @Post('/:ministryID/minister-song-key')
  @ApiCreatedResponse({
    description: 'The minister song key has been successfully created.',
    type: MinistryListItemResponse,
  })
  async createMinisterSongKey(
    @Res({ passthrough: true }) res: Response,
    @Param('ministryID') ministryID: number,
    @Body() ministerSongKeyRequest: IMinisterSongKeyRequest
  ): Promise<any> {
    try {
      const ministerSongKey = await this.ministryService.createMinisterSongKey(+ministryID, ministerSongKeyRequest);
      return ministerSongKey;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        res.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }

      throw error;
    }
  }

  @Delete('/:ministryID')
  async deleteMinistry(
    @Param('ministryID') ministryID: number,
    @Res({ passthrough: true }) res: Response
  ): Promise<void> {
    try {
      await this.ministryService.deleteMinistry(+ministryID);
      res.status(HttpStatus.NO_CONTENT);
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        console.error('error.message', error.message);
        res.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }

      throw error;
    }
  }

  @ApiQuery({ name: 'ministryID', required: true })
  @ApiQuery({ name: 'memberID', required: false })
  @Get('/:ministryID/roles')
  async getRolesByMinistryID(
    @Res({ passthrough: true }) res: Response,
    @Param('ministryID') ministryID: number,
    @Query('memberID') memberID?: number
  ): Promise<any[]> {
    try {
      const roles = await this.ministryService.getRolesByMinistryID(+ministryID, memberID);
      return roles;
    } catch (error) {
      if (error instanceof MinistryNotFoundError) {
        res.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
      }

      throw error;
    }
  }

  // @Post('/:ministryID/keys')
  // createMinistryKey(
  //   @Body() ministryKeyRequest: MinistryKeyRequest,
  //   @Param('ministryID') ministryID: number
  // ): MinistryKeyListItemResponse {
  //   const ministryKey = this.ministryService.createMinistryKey(ministryKeyRequest, +ministryID);
  //   return ministryKey;
  // }

  // @Get('/:ministryID/keys')
  // async getKeyListItems(
  //   @Param('ministryID') ministryID: number,
  //   @Res({ passthrough: true }) res: Response
  // ): Promise<MinistryKeyListItemResponse[]> {
  //   try {
  //     const keys = this.ministryService.getKeyListItems(+ministryID);
  //     return keys;
  //   } catch (error) {
  //     if (error instanceof MinistryNotFoundError) {
  //       return res.status(HttpStatus.BAD_REQUEST).send(error.message);
  //     }

  //     throw error;
  //   }
  // }

  // @Get('keys')
  // async getKeys(@Res({ passthrough: true }) res: Response): Promise<KeyResponse[]> {
  //   try {
  //     const keys = this.ministryService.getKeys();
  //     return keys;
  //   } catch (error) {
  //     if (error instanceof MinistryNotFoundError) {
  //       return res.status(HttpStatus.BAD_REQUEST).send(error.message);
  //     }

  //     throw error;
  //   }
  // }
}
