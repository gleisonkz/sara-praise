import { Role } from './role.dto';

export interface MemberListItemResponse {
  memberID: number;
  name: string;
  imageUrl: string;
  roles: Role[];
}
