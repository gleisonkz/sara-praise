import { eMinistryRole, ePermission } from '@sp/api/enums';

import { User } from 'apps/sp-api/src/app/models/user.model';

export interface Member {
  memberID: number;
  user: User;
  name: string;
  roles: eMinistryRole[];
  permissions: ePermission[];
}
