import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { MinistryService } from '../services';

@Controller('ministry')
export class MinistryController {
  constructor(private readonly ministryService: MinistryService) {}

  @Get('/list-item/:id?')
  getMinistriesListItems(@Param('id') id?: string): MinistryListItemResponse[] {
    const ministries = this.ministryService.getMinistriesListItems(id);
    console.log('ministries', ministries);
    return ministries;
  }

  @Post()
  createMinistry(@Body() ministryRequest: MinistryRequest): MinistryListItemResponse {
    console.log('ministryListItem', ministryRequest);

    const ministryListItem = this.ministryService.createMinistry(ministryRequest);

    console.log('ministryListItemResponse', ministryListItem);
    return ministryListItem;
  }
}
