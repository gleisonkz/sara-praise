import { BehaviorSubject, Observable } from 'rxjs';

import { Controller, Get, Param } from '@nestjs/common';
import { MINISTRY_LIST_ITEM_MOCK } from '@sp/api/mocks';
import { MinistryListItem } from '@sp/shared-interfaces';

@Controller('ministry')
export class MinistryController {
  private ministriesListItems$$ = new BehaviorSubject<MinistryListItem[]>(
    MINISTRY_LIST_ITEM_MOCK
  );

  @Get()
  getMinistriesListItems(
    @Param('id') id: string
  ): Observable<MinistryListItem[]> {
    console.log(id);
    return this.ministriesListItems$$.asObservable();
  }
}
