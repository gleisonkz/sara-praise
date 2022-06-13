export interface IMinisterSongKeyListItemResponse {
  memberImageUrl: string;
  memberName: string;
  artistName: string;
  songTitle: string;
  songKey: string;
}

export interface IMinisterSongKeyRequest {
  memberID: number;
  songID: number;
  keyID: number;
}
