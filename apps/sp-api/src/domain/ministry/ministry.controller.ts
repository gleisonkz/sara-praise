import {
    Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Res, UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtGuard } from '@sp/api/domain/auth';
import { SongListItemResponse } from '@sp/shared-interfaces';

import { Response } from 'express';
import { MinistryListItemResponseDto, MinistryRequestDto } from './dtos';
import { MinistryNotFoundError } from './ministry.error';
import { MinistryService } from './ministry.service';

@ApiTags('Ministérios')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('ministries')
export class MinistryController {
  constructor(private readonly ministryService: MinistryService) {}

  @ApiQuery({ name: 'ministryID', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    type: MinistryListItemResponseDto,
  })
  @Get('/list-item/:ministryID?')
  async getMinistriesListItems(@Param('ministryID') ministryID?: string): Promise<MinistryListItemResponseDto[]> {
    const parsedID = ministryID ? +ministryID : undefined;
    const ministries = await this.ministryService.getMinistriesListItems(parsedID);

    return ministries;
  }

  @Post()
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: MinistryListItemResponseDto,
  })
  async createMinistry(@Body() ministryRequest: MinistryRequestDto): Promise<MinistryListItemResponseDto> {
    console.log('ministryRequest', ministryRequest);
    const ministryListItem = this.ministryService.createMinistry(ministryRequest);
    return ministryListItem;
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
        res.status(HttpStatus.BAD_REQUEST).send(error.message);
        return;
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

  // @Get('/:ministryID/scale-list-items')
  // async getScales(
  //   @Param('ministryID') ministryID: number,
  //   @Res({ passthrough: true }) res: Response
  // ): Promise<ScaleListItemResponse[]> {
  //   try {
  //     const scales = await this.ministryService.getScales(+ministryID);
  //     return scales;
  //   } catch (error) {
  //     if (error instanceof MinistryNotFoundError) {
  //       return res.status(HttpStatus.BAD_REQUEST).send(error.message);
  //     }

  //     throw error;
  //   }
  // }

  // @Get('/:ministryID/scales/:scaleID/participants')
  // async getParticipants(
  //   @Param('ministryID') ministryID: number,
  //   @Param('scaleID') scaleID: number,
  //   @Res({ passthrough: true }) res: Response
  // ): Promise<any[]> {
  //   try {
  //     const participants = await this.ministryService.getParticipants(+ministryID, +scaleID);
  //     return participants;
  //   } catch (error) {
  //     if (error instanceof MinistryNotFoundError) {
  //       return res.status(HttpStatus.BAD_REQUEST).send(error.message);
  //     }

  //     throw error;
  //   }
  // }

  // @Post('/:ministryID/keys')
  // createMinistryKey(
  //   @Body() ministryKeyRequest: MinistryKeyRequest,
  //   @Param('ministryID') ministryID: number
  // ): MinistryKeyListItemResponse {
  //   const ministryKey = this.ministryService.createMinistryKey(ministryKeyRequest, +ministryID);
  //   return ministryKey;
  // }

  // @Post('/:ministryID/scale')
  // async createScale(
  //   @Param('ministryID') ministryID: number,
  //   @Body() scaleRequest: ScaleRequest
  // ): Promise<ScaleResponseCreate> {
  //   const scaleID = await this.ministryService.createScale(+ministryID, scaleRequest);
  //   return { scaleID };
  // }

  // @Delete('/scales/:scaleID')
  // async deleteScale(@Param('scaleID') scaleID: number, @Res({ passthrough: true }) res: Response): Promise<void> {
  //   try {
  //     await this.ministryService.deleteScale(+scaleID);
  //     res.status(HttpStatus.NO_CONTENT);
  //   } catch (error) {
  //     if (error instanceof ScaleNotFoundError) {
  //       console.error('error.message', error.message);
  //       return res.status(HttpStatus.BAD_REQUEST).send(error.message);
  //     }

  //     throw error;
  //   }
  // }

  // @Get('/scales/:scaleID')
  // async getScaleByID(
  //   @Param('scaleID') scaleID: number,
  //   @Res({ passthrough: true }) res: Response
  // ): Promise<ScaleResponse> {
  //   try {
  //     const scale = await this.ministryService.getScaleByIDAsync(+scaleID);
  //     return scale;
  //   } catch (error) {
  //     if (error instanceof MinistryNotFoundError) {
  //       return res.status(HttpStatus.BAD_REQUEST).send(error.message);
  //     }

  //     throw error;
  //   }
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

  // @Get('/scale-details/:scaleID')
  // async getScaleDetails(
  //   @Param('scaleID') scaleID: number,
  //   @Res({ passthrough: true }) res: Response
  // ): Promise<ScaleDetailResponse> {
  //   try {
  //     const scaleDetails: ScaleDetailResponse = await this.ministryService.getScaleDetails(+scaleID);
  //     return scaleDetails;
  //   } catch (error) {
  //     if (error instanceof MinistryNotFoundError) {
  //       return res.status(HttpStatus.BAD_REQUEST).send(error.message);
  //     }

  //     throw error;
  //   }
  // }
}
