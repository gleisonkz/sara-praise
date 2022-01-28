import { MINISTRY_LIST_ITEM_MOCK } from '@sp/api/mocks';
import { MinistryListItemResponse } from '@sp/shared-interfaces';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MinistryService {
  private ministriesListItems = MINISTRY_LIST_ITEM_MOCK;

  getMinistriesListItems(ministryID: string): MinistryListItemResponse[] {
    if (ministryID) {
      const ministries = this.ministriesListItems.filter((ministry) => ministry.ministryID === Number(ministryID));
      return ministries;
    }
    return this.ministriesListItems;
  }
}
