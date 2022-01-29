import { Injectable } from '@nestjs/common';

import { MinistryListItemRequest, MinistryListItemResponse } from '@sp/shared-interfaces';

import { MINISTRY_LIST_ITEM_MOCK } from '../mocks';

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

  createMinistryListItem(ministryListItem: MinistryListItemRequest): MinistryListItemResponse {
    const ministryListItemResponse: MinistryListItemResponse = {
      ministryID: this.ministriesListItems.length + 1,
      name: ministryListItem.name,
    };

    this.ministriesListItems.push(ministryListItemResponse);

    return ministryListItemResponse;
  }
}
