import { eSongKey } from 'apps/sp-api/src/ministry/enums';
import { Artist } from './artist.model';

export interface Song {
  songID: number;
  title: string;
  artist: Artist;
  tags: string[];
  key: eSongKey;
  bpm: number;
  observation: string;
  audioLink: string;
  youtubeLink: string;
  lyricLink: string;
  chordsLink: string;
}
