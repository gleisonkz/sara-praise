export interface SongListItemResponse {
  songID: number;
  title: string;
  artistName: string;
  tags: string[];
  key: string;
  hasAudioLink: boolean;
  hasYoutubeLink: boolean;
  hasLyricLink: boolean;
  hasChordsLink: boolean;
}
