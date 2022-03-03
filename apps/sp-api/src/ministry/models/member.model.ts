import { ePermission } from 'apps/sp-api/src/ministry/enums';
import { Role } from 'apps/sp-api/src/ministry/models';
import { User } from 'apps/sp-api/src/ministry/models/user.model';

export interface Member {
  ministryID: number;
  memberID: number;
  user: User;
  roles: Role[];
  permissions: ePermission[];
}

export interface Participant {
  participantID: number;
  memberID: number;
  scaleID: number;
  member: Member;
}
