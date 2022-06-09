import { IRoleResponse } from './role.dto';

export interface MemberListItemResponse {
  participantID?: number;
  memberID: number;
  name: string;
  imageUrl: string;
  roles: IRoleResponse[];
}

export interface MemberRequest {
  name: string;
  email: string;
  password: string;
  imageUrl: string;
  roles: number[];
}
