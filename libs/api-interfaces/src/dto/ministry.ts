export interface MinistryListItemResponse {
  ministryID: number;
  name: string;
}

export interface MinistryListItemRequest {
  name: string;
  ownerID: number;
}
