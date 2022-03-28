import { RoleResponse } from './role.dto';

export interface MemberListItemResponse {
  participantID?: number;
  memberID: number;
  name: string;
  imageUrl: string;
  roles: RoleResponse[];
}

export interface MemberRequest {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  roles: number[];
}
