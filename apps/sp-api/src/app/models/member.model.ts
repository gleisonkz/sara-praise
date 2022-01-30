import { eMinistryRole, ePermission } from '@sp/api/enums';

export interface Member {
  userID: number;
  name: string;
  roles: eMinistryRole[];
  permissions: ePermission[];
}
