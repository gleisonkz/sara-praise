import { Member } from './member.model';
import { Song } from './song.model';

export interface Scale {
  scaleID: number;
  title: string;
  date: string;
  notes: string;
  members: Member[];
  songs: Song[];
}
