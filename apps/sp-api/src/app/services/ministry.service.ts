import { Injectable } from '@nestjs/common';

import { MinistryListItemResponse, MinistryRequest } from '@sp/shared-interfaces';

import { MINISTRIES_MOCK } from '../mocks';

@Injectable()
export class MinistryService {
  private ministries = MINISTRIES_MOCK;

  getMinistriesListItems(ministryID: string): MinistryListItemResponse[] {
    return [];
    // if (ministryID) {
    //   const ministries = this.ministriesListItems.filter((ministry) => ministry.ministryID === Number(ministryID));
    //   return ministries;
    // }
    // return this.ministriesListItems;
  }

  createMinistry(ministryListItem: MinistryRequest): MinistryListItemResponse {
    return {
      ministryID: 1,
      name: 'Teste',
    };

    // const ministryListItemResponse: MinistryListItemResponse = {
    //   ministryID: this.ministriesListItems.length + 1,
    //   name: ministryListItem.name,
    // };

    // this.ministriesListItems.push(ministryListItemResponse);

    // return ministryListItemResponse;
  }
}
