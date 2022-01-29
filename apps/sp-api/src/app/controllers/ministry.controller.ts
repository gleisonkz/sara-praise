import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { MinistryListItemRequest, MinistryListItemResponse } from '@sp/shared-interfaces';

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

  @Post('/list-item')
  createMinistryListItem(@Body() ministryListItem: MinistryListItemRequest): MinistryListItemResponse {
    console.log('ministryListItem', ministryListItem);

    const ministryListItemResponse: MinistryListItemResponse =
      this.ministryService.createMinistryListItem(ministryListItem);

    console.log('ministryListItemResponse', ministryListItemResponse);
    return ministryListItemResponse;
  }
}
