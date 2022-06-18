import {
    Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Request, Res, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthRequest, JwtGuard } from '@sp/api/domain/auth';
import { IMinisterSongKeyRequest, MinistryListItemResponse } from '@sp/shared-interfaces';

import { Prisma } from '@prisma/client';
import { ePrismaErrorCode } from 'apps/sp-api/src/domain/prisma/prisma-error.enum';
import { Response } from 'express';
import { MinisterSongKeyListItemResponse, MinistryRequestDto } from './dtos';
import { DuplicatedMinistryNameError, MinistryNotFoundError } from './ministry.error';
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
    try {
      const ministryListItem = await this.ministryService.createMinistry(ministryRequest);
      return ministryListItem;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === ePrismaErrorCode.DUPLICATED_FIELD)
          throw new DuplicatedMinistryNameError(ministryRequest.name);
      }
    }
  }

  @ApiQuery({ name: 'ministryID', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MinistryListItemResponse,
  })
  @Get('/list-item/:ministryID?')
  async getMinistriesListItems(
    @Request() request: AuthRequest,
    @Param('ministryID') ministryID?: string
  ): Promise<MinistryListItemResponse[]> {
    const parsedID = ministryID ? +ministryID : undefined;
    const ministries = await this.ministryService.getMinistriesListItems(request.user.userID, parsedID);

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
  ): Promise<unknown> {
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
  ): Promise<unknown[]> {
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
}
