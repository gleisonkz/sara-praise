import { Member } from './member.model';
import { Song } from './song.model';

export interface Scale {
  title: string;
  date: Date;
  hour: number;
  notes: string;
  members: Member[];
  songs: Song[];
}
