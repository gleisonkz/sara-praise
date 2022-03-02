export interface MinistryListItemResponse {
  ministryID: number;
  name: string;
  musicsQuantity: number;
  membersQuantity: number;
  scalesQuantity: number;
  keysQuantity: number;
}

export interface MinistryRequest {
  name: string;
  ownerID: number;
}
