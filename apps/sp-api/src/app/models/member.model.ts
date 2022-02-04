import { ePermission } from '@sp/api/enums';
import { Role } from '@sp/api/models';

import { User } from 'apps/sp-api/src/app/models/user.model';

export interface Member {
  memberID: number;
  user: User;
  name: string;
  roles: Role[];
  permissions: ePermission[];
}
