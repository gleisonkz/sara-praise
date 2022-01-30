import { Injectable } from '@nestjs/common';

import { Ministry } from '@sp/api/models';
import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { MINISTRIES_MOCK } from '../mocks';

@Injectable()
export class MinistryService {
  private ministries: Ministry[] = MINISTRIES_MOCK;

  getMinistriesListItems(ministryID?: string): MinistryListItemResponse[] {
    const ministryPredicate = (ministry: Ministry) => ministry.ministryID === Number(ministryID);

    const filteredMinistries: Ministry[] = ministryID ? this.ministries.filter(ministryPredicate) : this.ministries;

    const ministriesListItems: MinistryListItemResponse[] = filteredMinistries.map((ministry) => {
      const ministryListItem: MinistryListItemResponse = {
        ministryID: ministry.ministryID,
        name: ministry.name,
      };

      return ministryListItem;
    });

    return ministriesListItems;
  }

  createMinistry(ministryListItem: MinistryRequest): MinistryListItemResponse {
    const ministry: Ministry = {
      ministryID: this.ministries.length + 1,
      name: ministryListItem.name,
      ownerId: ministryListItem.ownerID,
      members: [],
      roles: [],
      scales: [],
      songs: [],
    };

    const ministryListItemResponse: MinistryListItemResponse = {
      ministryID: ministry.ministryID,
      name: ministry.name,
    };

    this.ministries.push(ministry);
    return ministryListItemResponse;
  }
}
