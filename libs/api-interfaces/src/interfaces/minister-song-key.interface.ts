export interface MinisterSongKeyListItemResponse {
  memberImageUrl: string;
  memberName: string;
  artistName: string;
  songTitle: string;
  songKey: string;
}

export interface MinisterSongKeyRequest {
  memberID: number;
  songID: number;
  keyID: number;
}
