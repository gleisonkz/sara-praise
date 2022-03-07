import { Participant } from 'apps/sp-api/src/domain/ministry/models/member.model';
import { Song } from './song.model';

export interface Scale {
  scaleID: number;
  title: string;
  date: Date;
  notes: string;
  participants: Participant[];
  songs: Song[];
}
