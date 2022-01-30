export interface MinistryListItemResponse {
  ministryID: number;
  name: string;
}

export interface MinistryRequest {
  name: string;
  ownerID: number;
}
