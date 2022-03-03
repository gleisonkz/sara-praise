import { Participant } from 'apps/sp-api/src/ministry/models';
import { Song } from './song.model';

export interface Scale {
  scaleID: number;
  title: string;
  date: Date;
  notes: string;
  participants: Participant[];
  songs: Song[];
}
