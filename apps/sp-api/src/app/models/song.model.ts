import { eSongKey } from '@sp/api/enums';

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
