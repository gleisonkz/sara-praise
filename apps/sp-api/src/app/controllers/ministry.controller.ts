import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';

import {
    MinistryListItemResponse, MinistryRequest, ScaleListItemResponse
} from '@sp/shared-interfaces';

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
  getScales(@Param('id') id: number, @Res({ passthrough: true }) res: Response): ScaleListItemResponse[] {
    try {
      const scales = this.ministryService.getScales(+id);
      return scales;
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
}
