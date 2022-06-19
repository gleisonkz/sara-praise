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
export interface ScaleSongResponse {
  scaleSongID: number;
  songID: number;
  title: string;
  artistName: string;
  tags: string[];
  key: string;
  memberID: number;
  memberName: string;
  memberImageUrl: string;
  hasAudioLink: boolean;
  hasYoutubeLink: boolean;
  hasLyricLink: boolean;
  hasChordsLink: boolean;
}

export interface AvailableScaleSongResponse {
  scaleSongID: number;
  songID: number;
  title: string;
  artistName: string;
  member?: {
    memberID: number;
    memberName: string;
  };
  tags: string[];
  key: string;
  hasAudioLink: boolean;
  hasYoutubeLink: boolean;
  hasLyricLink: boolean;
  hasChordsLink: boolean;
  isChecked: boolean;
}

export type SongRequest = Omit<SongResponse, 'songID'>;
export interface ScaleSongRequest {
  scaleSongID?: number;
  songID: number;
  scaleID: number;
  memberID?: number;
  isChecked: boolean;
  artistName: string;
  songTitle: string;
}
