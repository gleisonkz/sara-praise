import { RoleResponse } from '@sp/shared-interfaces';

import { ePermission } from 'apps/sp-api/src/domain/ministry/enums';
import { User } from 'apps/sp-api/src/domain/ministry/models';

export interface Member {
  ministryID: number;
  memberID: number;
  user: User;
  roles: RoleResponse[];
  permissions: ePermission[];
}

export interface Participant {
  participantID: number;
  memberID: number;
  scaleID: number;
  member: Member;
}
