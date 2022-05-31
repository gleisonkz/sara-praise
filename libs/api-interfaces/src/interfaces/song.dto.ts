export interface SongResponse {
  songID: number;
  title: string;
  artistID: number;
  tags: string[];
  keyID: number;
  audioUrl: string;
  youtubeUrl: string;
  lyricUrl: string;
  chordsUrl: string;
  observations: string;
}

export interface AvailableSongResponse {
  songID: number;
  title: string;
  artistName: string;
}

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

export type SongRequest = Omit<SongResponse, 'songID'>;
