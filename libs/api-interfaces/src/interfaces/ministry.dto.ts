export interface MinistryListItemResponse {
  ministryID: number;
  name: string;
  musicsQuantity: number;
  membersQuantity: number;
  scalesQuantity: number;
  songKeysQuantity: number;
  artistQuantity: number;
}

export interface MinistryRequest {
  name: string;
  ownerID: number;
}
