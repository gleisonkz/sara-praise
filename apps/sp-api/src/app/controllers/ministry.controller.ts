import { Controller, Get, Param } from '@nestjs/common';
import { MinistryService } from '@sp/api/services';

@Controller('ministry')
export class MinistryController {
  constructor(private readonly ministryService: MinistryService) {}

  @Get('/:id?')
  async getMinistriesListItems(@Param('id') id?: string) {
    const ministries = this.ministryService.getMinistriesListItems(id);
    return ministries;
  }
}
