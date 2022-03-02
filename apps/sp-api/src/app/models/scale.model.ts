import { Participant } from '@sp/api/models';

import { Song } from './song.model';

export interface Scale {
  scaleID: number;
  title: string;
  date: Date;
  notes: string;
  participants: Participant[];
  songs: Song[];
}
