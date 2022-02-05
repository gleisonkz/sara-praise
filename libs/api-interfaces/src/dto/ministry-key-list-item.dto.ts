export interface MinistryKeyListItemResponse {
  ministryKeyID: number;
  memberImageUrl: string;
  memberName: string;
  artistName: string;
  songTitle: string;
  songKey: string;
}

export interface MinistryKeyRequest {
  memberID: number;
  songID: number;
  keyID: number;
}
