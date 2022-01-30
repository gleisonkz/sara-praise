import { Member } from './member.model';
import { Role } from './role.model';
import { Scale } from './scale.model';
import { Song } from './song.model';

export interface Ministry {
  ministryID: number;
  name: string;
  ownerId: number;
  members: Member[];
  scales: Scale[];
  songs: Song[];
  roles: Role[];
}
