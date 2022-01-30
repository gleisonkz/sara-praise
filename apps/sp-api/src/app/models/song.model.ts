import { eSongKey } from '@sp/api/enums';

export interface Song {
  songID: number;
  title: string;
  artistName: string;
  tags: string[];
  key: eSongKey;
  bpm: number;
  observation: string;
  audioLink: string;
  youtubeLink: string;
  lyricLink: string;
  chordsLink: string;
}
