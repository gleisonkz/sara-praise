export interface IMinisterSongKeyListItemResponse {
  memberImageUrl: string;
  memberName: string;
  artistName: string;
  songTitle: string;
  songKey: string;
  songKeyID: number;
  memberID: number;
  songID: number;
}

export interface IMinisterSongKeyRequest {
  memberID: number;
  songID: number;
  keyID: number;
}
