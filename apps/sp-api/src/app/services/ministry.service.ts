import { Injectable } from '@nestjs/common';

import { Ministry, Scale } from '@sp/api/models';
import {
    MinistryListItemResponse, MinistryRequest, ScaleListItemResponse
} from '@sp/shared-interfaces';

import { MINISTRIES_MOCK } from '../mocks';

export class MinistryNotFoundError extends Error {
  constructor(public ministryID: number) {
    super(`Ministry with ID ${ministryID} not found`);
  }
}

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

  getScales(ministryID: number): ScaleListItemResponse[] {
    const ministry = this.ministries.find((ministry) => ministry.ministryID === ministryID);

    if (!ministry) throw new MinistryNotFoundError(ministryID);

    const imageUrlMapFn = (scale: Scale) => scale.members.map((member) => member.user.imageUrl);

    const scales: ScaleListItemResponse[] = ministry.scales.map((scale) => {
      const scaleListItem: ScaleListItemResponse = {
        scaleID: scale.scaleID,
        title: scale.title,
        date: scale.date,
        imagesUrl: imageUrlMapFn(scale),
        notes: scale.notes,
        songsQuantity: scale.songs.length,
      };

      return scaleListItem;
    });

    return scales;
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
