import { Role } from './role.dto';

export interface MemberListItemResponse {
  participantID?: number;
  memberID: number;
  name: string;
  imageUrl: string;
  roles: Role[];
}
